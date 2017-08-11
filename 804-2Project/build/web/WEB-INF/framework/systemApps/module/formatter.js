/*
 * The contents of this file are subject to the terms 
 * of the Common Development and Distribution License 
 * (the License).  You may not use this file except in
 * compliance with the License.
 * 
 * You can obtain a copy of the license at 
 * https://glassfish.dev.java.net/public/CDDLv1.0.html or
 * glassfish/bootstrap/legal/CDDLv1.0.txt.
 * See the License for the specific language governing 
 * permissions and limitations under the License.
 * 
 * When distributing Covered Code, include this CDDL 
 * Header Notice in each file and include the License file 
 * at glassfish/bootstrap/legal/CDDLv1.0.txt.  
 * If applicable, add the following below the CDDL Header, 
 * with the fields enclosed by brackets [] replaced by
 * you own identifying information: 
 * "Portions Copyrighted [year] [name of copyright owner]"
 * 
 * Copyright 2007 Sun Microsystems, Inc. All rights reserved.
 */

// Formatter module

library.common.define(module.system, "formatter", function() {
    var log = library.log.get("application");
    
    /**
     * Format a comment as HTML, replacing tags with markup.
     */
    function asHTML(s) {
        // reflow paragraphs
        
        var machine = {
            state: "start",
            re: /@(\w+)(\s|\()/,
            info: { params: [], kparams: {}, hasKeywordParams: false, "return": undefined, kreturns: {}, hasKeywordReturns: false},
            processAll: function(comment) {
                var lines = comment.split("\n");
                this.result = this.para = this.tag = "";
                for (var i = 0; i < lines.length; ++i) {
                    this.process(this.normalize(lines[i]), lines[i]);
                }
                this.process("");
                this.retry("end", "");
                return this;
            },
            process: function(line, originalLine) {
                this["at_" + this.state](line, originalLine);
            },
            enter: function(newState) {
                this.state = newState;
            },
            retry: function(newState, line) {
                this.enter(newState);
                this.process(line);
            },
            at_start: function(line) {
                this.retry("newSection", line);
            },
            at_newSection: function(line) {
                if (this.isTagStart(line)) {
                    this.retry("newTag", line);
                    return;
                }
                if (this.isVerbatimStart(line)) {
                    this.retry("newVerbatim", line);
                    return;
                }
                if (line) {
                    this.retry("newPara", line);
                }
            },
            at_newPara: function(line) {
                this.para = line;
                this.enter("inPara");
            },
            at_inPara: function(line) {
                if (line) {
                    this.para += " ";
                    this.para += line;
                }
                else {
                    this.appendPara();
                    this.enter("newSection");
                }
            },
            at_newTag: function(line) {
                var tagName = this.match[1];
                this.tag = {name: tagName, text: "", params: []};
                var endTagName = this.match[0].length - 1;
                var nextChar = line.charAt(endTagName);
                if (nextChar == "(") {
                    var j = line.indexOf(")", endTag);
                    if (j != -1) {
                        var endTag = j;
                        var s2 = line.substring(endTagName + 1, endTag);
                        if (s2 != "") { 
                            var params = s2.split(",");
                            for (var i = 0; i < params.length; ++i) {
                                var p = params[i];
                                p = p.replace(/^\s*/, "");
                                p = p.replace(/\s*$/, "");
                                params[i] = p;
                            }
                            this.tag.params = params;
                        }
                        this.tag.text = this.normalize(line.substring(endTag + 1));
                    }
                }
                else {
                    this.tag.text = this.normalize(line.substring(endTagName + 1));
                }
                this.enter("inTag");
            },
            at_inTag: function(line) {
                if (!line) {
                    this.appendTag(this.tag);
                    this.enter("newSection");
                }
                else if (this.isTagStart(line)) {
                    this.appendTag(this.tag);
                    this.retry("newTag", line);
                }
                else {
                    this.tag.text += " ";
                    this.tag.text += line;
                }
            },
            at_newVerbatim: function(line) {
                this.verbatim = "";
                this.enter("inVerbatim");
            },
            at_inVerbatim: function(line, originalLine) {
                if (this.isVerbatimEnd(line)) {
                    this.appendVerbatim();
                    this.enter("newSection");
                }
                else {
                    this.verbatim += originalLine;
                    this.verbatim += "\n";
                }
            },
            at_end: function() {
                this.describeMetadata();
            },
            normalize: function(line) {
                return line.replace(/^(\s+)/, "");
            },
            append: function(s) {
                this.result += s;
            },
            appendText: function(s) {
                this.result += "<p>";
                this.result += s;
                this.result += "</p>";
            },
            appendVerbatim: function() {
                this.result += "<pre>";
                this.result += this.verbatim;
                this.result += "</pre>";
            },
            appendPara: function() {
                this.appendText(this.processLineFormatting(this.para));
            },
            appendTag: function(tag) {
                this.result += this.expandTag(tag);
            },
            isTagStart: function(line) {
                if (line && line.charAt(0) == "@") {
                    this.match = this.re.exec(line);
                    return !!this.match;
                }
                return false;
            },
            isVerbatimStart: function(line) {
                return line && line.substring(0, 3) == "{{{";
            },
            isVerbatimEnd: function(line) {
                return line && line.substring(0, 3) == "}}}";
            },
            expandTag: function(tag) {
                switch(tag.name) {
                    case "param": {
                        this.info.params.push({name: tag.params[0], type: tag.params[1], info: tag.params[2], comment: tag.text});
                        break;
                    }
                    case "kparam": {
                        this.info.kparams[tag.params[0]] = {type: tag.params[1], info: tag.params[2], comment: tag.text};
                        this.info.hasKeywordParams = true;
                        break;
                    }
                    case "return": {
                        this.info["return"] = {type: tag.params[0], comment: tag.text};
                        break
                    }
                    case "kreturn": {
                        this.info.kreturns[tag.params[0]] = {type: tag.params[1], info: tag.params[2], comment: tag.text};
                        this.info.hasKeywordReturns = true;
                        break;
                    }
                }
                return "";
            },
            describeMetadata: function() {
                var self = this;
                function makeColumn(s) {
                    return "<td>" + (s ? s : "&nbsp;") + "</td>";
                }
                function format2(type, comment) {
                    var s = makeColumn(type || "any");
                    s += makeColumn(self.processLineFormatting(comment));
                    return s;
                }
                function format4(name, type, info, comment) {
                    var s = makeColumn(name);
                    s += makeColumn(type || "any");
                    s += makeColumn(info);
                    s += makeColumn(self.processLineFormatting(comment));
                    return s;
                }
                if (this.info.params.length) {
                    this.append("<div class=\"metadataHeader\">Arguments</div>");
                    this.append("<table class=\"metadata\"><tr><th>Name</th><th>Type</th><th>Status</th><th class=\"metadataComment\">Description</th></tr>");
                    for (var i = 0; i < this.info.params.length; ++i) {
                        var param = this.info.params[i];
                        this.append("<tr>");
                        this.append(format4(param.name, param.type, param.info, param.comment));
                        this.append("</tr>");
                    }
                    this.append("</table>");
                }
                if (this.info.hasKeywordParams) {
                    this.append("<div class=\"metadataHeader\">Keyword arguments</div>");
                    this.append("<table class=\"metadata\"><tr><th>Name</th><th>Type</th><th>Status</th><th class=\"metadataComment\">Description</th></tr>");
                    for (var name in this.info.kparams) {
                        var param = this.info.kparams[name];
                        this.append("<tr>");
                        this.append(format4(name, param.type, param.info, param.comment));
                        this.append("</tr>");
                    }
                    this.append("</table>");
                }
                if (this.info["return"]) {
                    this.append("<div class=\"metadataHeader\">Return value</div>");
                    var param = this.info["return"];
                    this.append("<table class=\"metadata\"><tr><th>Type</th><th class=\"metadataComment\">Description</th></tr>");
                    this.append(format2(param.type, param.comment));
                    this.append("</tr></table>");
                }
                if (this.info.hasKeywordReturns) {
                    this.append("<div class=\"metadataHeader\">Keyword return values</div>");
                    this.append("<table class=\"metadata\"><tr><th>Name</th><th>Type</th><th>Status</th><th class=\"metadataComment\">Description</th></tr>");
                    for (var name in this.info.kreturns) {
                        var param = this.info.kreturns[name];
                        this.append("<tr>");
                        this.append(format4(name, param.type, param.info, param.comment));
                        this.append("</tr>");
                    }
                    this.append("</table>");
                }                
            },
            processLineFormatting: function(s) {
                return expandTokens(s,
                            [{start:"__", end: "__", tag: "u"},
                            {start: "''", end: "''", tag: "b"},
                            {start: "//", end: "//", tag: "i"},
                            {start: "{{", end: "}}", tag: "tt"},
                            {start: "``", end: "``", tag: "tt"},
                            {start: "[[", end: "]]", fn: function(body) {
                                    var href = body;
                                    var i = body.indexOf("|");
                                    if (i != -1) {
                                        href = body.substring(i + 1);
                                        body = body.substring(0, i);
                                    }
                                    return "<a href=\"" + href + "\">" + body + "</a>";
                                 }},
                            {start: "&&", end: "&&", fn: function(body) {
                                    return "<div class=\"metadataHeader\">" + body + "</div>";
                                 }}]);
            }
        };

        // helper function
        function expandTokens(s, expansions) {
            var result = "";
            var i = 0;
            var keepExpanding = true;
            while (keepExpanding) {
                var data = [];
                for (var j = 0; j < expansions.length; ++j) {
                    var next = s.indexOf(expansions[j].start, i);
                    if (next != -1) {
                        data.push({pos: next, expansion: expansions[j]});
                    }
                }
                data.sort(function (v1, v2) {
                    return ((v1.pos < v2.pos) ? -1 : ((v1.pos > v2.pos) ? 1 : 0));
                });
                keepExpanding = false; // stop unless we perform a replacement
                for (var j = 0; j < data.length; ++j) {
                    var candidate = data[j];
                    var k = s.indexOf(candidate.expansion.end, candidate.pos + candidate.expansion.start.length);
                    if (k != -1) {
                        result += s.substring(i, candidate.pos);
                        var body = s.substring(candidate.pos + candidate.expansion.start.length, k);
                        if (candidate.expansion.fn) {
                            result += candidate.expansion.fn.call(candidate.expansion, body);
                        }
                        else if (candidate.expansion.tag) {
                            result += "<";
                            result += candidate.expansion.tag;
                            result += ">";
                            result += body;
                            result += "</";
                            result += candidate.expansion.tag;
                            result += ">";
                        }
                        i = k + candidate.expansion.end.length;
                        keepExpanding = true;
                        break;
                    }
                }
            }
            result += s.substring(i);
            return result;            
        }
        
        s = machine.processAll(s).result;
        
        return s;
    }
        
    // exports
    this.asHTML = asHTML;
});
