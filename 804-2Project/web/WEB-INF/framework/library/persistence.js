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
 * Copyright 2006 Sun Microsystems, Inc. All rights reserved.
 */

/**
 * Persistence library module.
 */

library.common.define(library, "persistence", function() {

    var log = library.log.get("framework.persistence");

    /**
     * Return a sorted array of the persistence unit names. This would be used for displaying
     * a listbox from which the user could select a pu to work with. 
     * 
     * returns:
     * [StringPuName1,StringPuName2,...]
     *
     */    
    this.getPUNames = function() {
        var puList = this.checkGlobalsForPusList();
        var punames = [];
        for (var punm in puList) {
            punames[punm] = puList[punm].puname;
        }
        punames = punames.sort();
        return punames;
    } //getPUNames

    this.checkGlobalsForPusList = function() {
        var globals = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();

        // check to see if we have the puList in the globals map 
        var puList = globals.get("__puList__");

        if (puList == null) {
            puList = getPUInfo();
            globals.put("__puList__",puList);
        }
        return puList;
    }
    
    this.checkGlobalsForClassesInfo = function(puname) {
        var puList  = this.checkGlobalsForPusList();
        var globals = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();
        var lookupPUName = "__" + puname + "__";
        
        // check the globals map to get the classesInfo for a given puname
        var classesInfo = globals.get(lookupPUName);
        //log.trace(" \n\t\t\t\t checkGlobalsForPusList, classesInfo obtained from global map = " + classesInfo);
        if (classesInfo == null) {
            classesInfo = getAllClassesInfo(puList,puname);
            globals.put(lookupPUName,classesInfo);
        }
        return classesInfo;
    }
    
    this.getClassAttributesForColNames = function(columns,className,puname) {
        var classesInfo = this.checkGlobalsForClassesInfo(puname);
        var entityInfo = classesInfo[className.toLowerCase()];        
        var clsAttributes = classesInfo[className.toLowerCase()].attributes;
        
        var clsAttrbs = {};
        for (var colPos in columns) {
            var colName = columns[colPos];
            clsAttrbs[colName] = clsAttributes[colName];
        }
        return clsAttrbs;
    } //getClassAttributesForColNames

    /**
     * From the classpath construct  list of all the persistence unit names and the
     * entity classes that are managed by each PU. 
     * Found that there is a toplink static helper class "PersistenceUnitProcessor" that could be used to
     * achieve this. 
     * TODO:::As part of a JPA vendor nuetral solution, need to get this and its related classes
     * as a seperate jar that could be used as part of Phobos.
     *
     * This function returns an Array, whose each entry is a 
     * Hashtable consisting of information from the associated persistence.xml:
     * puname        = Persistence Unit (PU) name
     * entityClasses = Return an array of the "managed entity classes" for this PU name. 
     *     
     * returns:
     * [ { puname: String, entityClasses: [Class,Class,...] }, 
     *   { puname: String, entityClasses: [Class,...] },
     *    ... 
     * ]
     *
     */
    function getPUInfo() {
        var pusInfo = []; // define an Array
        var puProcessor    = Packages.oracle.toplink.essentials.ejb.cmp3.persistence.PersistenceUnitProcessor;
        var metadataHelper = Packages.oracle.toplink.essentials.internal.ejb.cmp3.metadata.MetadataHelper;        

        var classLoader = Packages.java.lang.Thread.currentThread().getContextClassLoader();
        var puArchives =  puProcessor.findPersistenceArchives(); // would return a url
        var urlIterator = puArchives.iterator();
        var i = 0;
        while (urlIterator.hasNext()) {
            var url = urlIterator.next(); //Each is SEPersistenceUnitInfo
            
            var puUnits = puProcessor.getPersistenceUnits(url,classLoader); // returns list of SEPersistenceUnitInfo 
            var SEPUs = puUnits.iterator();
            while (SEPUs.hasNext()) {
                var puList = {}; // declaring a hashtable/Object
                var entityClasses = [];
                var j = 0;
                var puInfo = SEPUs.next(); //Each is SEPersistenceUnitInfo
                var puName = puInfo.getPersistenceUnitName(); 
                var managedClassNames = puInfo.getManagedClassNames().toArray();
                var puClasses = [];
                
                for (var mgCl in managedClassNames) {
                    var className = managedClassNames[mgCl];
                    var managedClass = metadataHelper.getClassForName(className,classLoader); // would return class for a given classname
                    puClasses[mgCl] = managedClass;
                }
                puList.puname        = puName;
                puList.entityClasses = puClasses.sort();
                pusInfo.push(puList);
            } // process each SEPersistenceUnitInfo
        } // process each url in classpath

        return pusInfo;        
    } //getPUInfo

    /**
     * From the array that is obtained from the getPUInfo function get a sorted 
     * array of the managed classed for a given puName. 
     * 
     * returns:
     * [EntityClass1,EntityClass2,...]
     *
     */
    function getClassesForPU(puList,puName) {
        var classesOfPU;
        
        for (var punm in puList) {
            if (puList[punm].puname == puName) {
                classesOfPU = puList[punm].entityClasses;
                break;
            }
        }
        return classesOfPU;
    } //getClassesForPU
    
    /**
     * Process each managed entity class that is part of a persistence unit, and 
     * retrieve more information for that class. This information consists of 
     * fields, get and set methods, entityName.
     *
     */
    function getAllClassesInfo(puList,puName) {
        var allClassesInfo   = {};
        var entityClasses    = {};
        var classesInherited = {};
        var classesEmbedded  = {};
        var classesMapSuper  = {};
        var classesOfPU      = getClassesForPU(puList,puName);
        var entityInfo;
        var entityClass;
        var persistentClass;
        
        // Process the classes into different buckets for processing
        for (var cl in classesOfPU) {
            persistentClass = classesOfPU[cl];
            var displayName = persistentClass.getSimpleName();
            var lookupName  = displayName.toLowerCase();
            
            if (!persistentClass.getSuperclass().getName().equals("java.lang.Object")) {
                classesInherited[lookupName] = persistentClass;
                continue;
            }
            
            var entityAnt      = Packages.java.lang.Class.forName("javax.persistence.Entity");
            var embeddableAnt  = Packages.java.lang.Class.forName("javax.persistence.Embeddable");
            var mappedSuperAnt = Packages.java.lang.Class.forName("javax.persistence.MappedSuperclass");

            if (persistentClass.isAnnotationPresent(entityAnt)) {
                entityClasses[lookupName] = persistentClass;
            } else if (persistentClass.isAnnotationPresent(embeddableAnt)) {
                classesEmbedded[lookupName] = persistentClass;
            } else if (persistentClass.isAnnotationPresent(mappedSuperAnt)) {
                classesMapSuper[lookupName] = persistentClass; // TODO:: Deal with them
            }
        }
        
        // Process persistence classes with @Entity first
        // TODO:: need to deal with abstract classes
        for (var cl in entityClasses) {
            entityClass = entityClasses[cl];
            processEntityClass(entityClass,allClassesInfo);
        }
        
        // Next deal with subclasses of the entity classes that we processed above.
        // In case of inheritance ensure that the parent class has been processed before dealing with the children
        for (var incl in classesInherited) {
            entityClass = classesInherited[incl];
            processInheritedClass(classesInherited[incl],allClassesInfo,classesInherited);
        }
        
        // Now deal with the Embeddable classes, since by now all the containing/parent entities should have been processed
        // If there is an Embeddable class for which there is no caller we would ignore that class.
        for (var embcl in classesEmbedded) {
            entityClass = classesEmbedded[embcl];
            processEmbeddableClass(entityClass,allClassesInfo);
        }
        return allClassesInfo;
    } //getAllClassesInfo
    
    function processInheritedClass(javaClass,allClassesInfo,classesInherited) {
        var displayName = javaClass.getSimpleName();
        var parentClass = javaClass.getSuperclass();
        var parentDisplayName = parentClass.getSimpleName();
        var parentLookupName  = parentDisplayName.toLowerCase();
        var entityInfo;
        if(parentLookupName in allClassesInfo) {
            entityInfo              = addParentClassAttributes(parentDisplayName,allClassesInfo);
            entityInfo.jpaTableName = getEntityDisplayName(javaClass);
            entityInfo.displayName  = javaClass.getSimpleName();
            commonPersistentClassProcessing(javaClass,entityInfo,allClassesInfo);
            getIdClassInfo(javaClass,entityInfo,allClassesInfo);
        } else {
            // Not sure if adding into the same object will work correctly in the outer for loop called from
            // getAllClassesInfo()
            classesInherited[parentDisplayName.toLowerCase()] = parentClass;
            return;
        }
        if (entityInfo != null) {
            allClassesInfo[displayName.toLowerCase()] = entityInfo;
        }
    } //processInheritedClass
     
    /**
     * Reflect on a given class, to get information about the class. We are interested in the following
     * info : fields, getMethods, setMethods, relationships to other classes.
     * 
     * This function returns an Array containing information related to the specified class
     *
     */   
    function processEntityClass(javaClass,allClassesInfo) {
        var displayName         = javaClass.getSimpleName();
        var entityInfo          = new EntityInfo();
        entityInfo.displayName  = displayName;
        entityInfo.jpaTableName = getEntityDisplayName(javaClass);
        entityInfo.accessType   = getClassAccessType(javaClass.getDeclaredFields());
        getDiscriminatorInfo(javaClass,entityInfo);
        entityInfo.attributes   = {};
        entityInfo.persistentType = "entity";

        commonPersistentClassProcessing(javaClass,entityInfo,allClassesInfo);
        getIdClassInfo(javaClass,entityInfo,allClassesInfo);
        allClassesInfo[displayName.toLowerCase()] = entityInfo;
    } //processInheritedClass
    
   function processEmbeddableClass(javaClass,allClassesInfo) {
        var displayName = javaClass.getSimpleName();
        var entityInfo = allClassesInfo[displayName.toLowerCase()];
        if (entityInfo != null) {
            commonPersistentClassProcessing(javaClass,entityInfo,allClassesInfo);
            allClassesInfo[displayName.toLowerCase()] = entityInfo;
        }
    } //processEmbeddableClass
    
    function commonPersistentClassProcessing(javaClass,entityInfo,allClassesInfo) {       
        entityInfo.javaClass    = javaClass;        
        // Continue to processing of Fields/Methods/Annotations of the Persistent Class.
        getFieldsMethodsInfoForClass(entityInfo);
        processFieldMethodAnnotations(entityInfo,allClassesInfo);
    } //commonPersistentClassProcessing
    
    function addParentClassAttributes(parentDisplayName,allClassesInfo) {
        var entityInfo = new EntityInfo();
        entityInfo.accessType   = allClassesInfo[parentDisplayName.toLowerCase()].accessType;
        entityInfo.discrimCol   = allClassesInfo[parentDisplayName.toLowerCase()].discrimCol;
        entityInfo.displayName  = parentDisplayName;
        entityInfo.attributes   = {};
        entityInfo.persistentType = "entity";
        
        for (var attrb in allClassesInfo[parentDisplayName.toLowerCase()].attributes) {
            var parentAttrbInfo = allClassesInfo[parentDisplayName.toLowerCase()].attributes[attrb];
            var attributeInfo = new AttributeInfo();
            attributeInfo.fieldName    = parentAttrbInfo.fieldName;
            attributeInfo.fieldClass   = parentAttrbInfo.fieldClass;
            attributeInfo.isPrimaryKey = parentAttrbInfo.isPrimaryKey;
            attributeInfo.isInsertable = parentAttrbInfo.isInsertable;
            attributeInfo.isUpdateable = parentAttrbInfo.isUpdateable;
            attributeInfo.collectionEntityClass = parentAttrbInfo.collectionEntityClass;
            attributeInfo.owningEntity = parentAttrbInfo.owningEntity;

            if (entityInfo.accessType == "field") {
                attributeInfo.valueInterface = new FieldValueInterface();
                attributeInfo.valueInterface.field = parentAttrbInfo.valueInterface.field;
            } else if (entityInfo.accessType == "property") {
                attributeInfo.valueInterface = new MethodValueInterface();
                attributeInfo.valueInterface.getMethod = parentAttrbInfo.valueInterface.getMethod;
                attributeInfo.valueInterface.setMethod = parentAttrbInfo.valueInterface.setMethod;
            }
            
            attributeInfo.mapping = parentAttrbInfo.mapping;
            entityInfo.attributes[attrb] = attributeInfo;
        }
        
        return entityInfo;
    } //addParentClassAttributes
    
    /**
     * For a given class, retrieve information about the attributes
     *
     */
    function getFieldsMethodsInfoForClass(entityInfo) {
        var classCurr = entityInfo.javaClass;

        if (entityInfo.accessType == "property") {
            var allMethods = classCurr.getDeclaredMethods();
            processAllMethods(allMethods,entityInfo);
        } else {
            var allFields = classCurr.getDeclaredFields();
            processAllFields(allFields,entityInfo);
        }
    } //getFieldsMethodsInfoForClass

    function getClassAccessType(allFields) {
        var accessType = "property";
        var idAnnotation = Packages.java.lang.Class.forName("javax.persistence.Id");
        for (var fld in allFields) {
            var currField = allFields[fld];
            if (currField.isAnnotationPresent(idAnnotation)) {
                accessType = "field";
                break;
            }
        }
        return accessType;
    } //getClassAccessType

    function getDiscriminatorInfo(javaClass,entityInfo) {
        var discrimColAnnot = javaClass.getAnnotation(Packages.javax.persistence.DiscriminatorColumn);
        if (discrimColAnnot != null) {
            entityInfo.discrimCol = discrimColAnnot.name();
        }
    } //getDiscriminatorInfo
    
    function getIdClassInfo(javaClass,parentEntityInfo,allClassesInfo) {
        var idclassAnnot = javaClass.getAnnotation(Packages.javax.persistence.IdClass);
        if (idclassAnnot != null) {
            var parentEntityName = javaClass.getSimpleName();
            var idClass          = idclassAnnot.value();
            var displayName      = idClass.getSimpleName();
            parentEntityInfo.idClass = idClass;
            
            var entityInfo          = new EntityInfo();
            entityInfo.javaClass    = idClass;
            entityInfo.accessType   = parentEntityInfo.accessType;
            entityInfo.jpaTableName = parentEntityInfo.jpaTableName;
            entityInfo.displayName  = displayName;
            entityInfo.attributes   = {};
            entityInfo.persistentType = "idclass";
            commonPersistentClassProcessing(idClass,entityInfo,allClassesInfo);
            
            allClassesInfo[displayName.toLowerCase()] = entityInfo;
        }
    } //getIdClassInfo
    
    function processAllMethods(allMethods,entityInfo) {
        var classCurr = entityInfo.javaClass;
        var metadataHelper = Packages.oracle.toplink.essentials.internal.ejb.cmp3.metadata.MetadataHelper;
        
        for (var m in allMethods) {
            var currMethod     = allMethods[m];
            var currMethodName = currMethod.getName();  
            var currCollClassType;
            var isPersistenceMethod = metadataHelper.isValidPersistenceMethodName(currMethodName); 
            if (isPersistenceMethod) {                 
                // Ignore get methods with parameters.
                if (currMethod.getParameterTypes().length > 0) {
                    continue;
                }
                
                // Methods with static, abstract, transient and private modifiers are not persistence methods
                if (java.lang.reflect.Modifier.isStatic(currMethod.getModifiers()) ||
                    java.lang.reflect.Modifier.isTransient(currMethod.getModifiers()) ||
                    java.lang.reflect.Modifier.isAbstract(currMethod.getModifiers()) ||
                    java.lang.reflect.Modifier.isPrivate(currMethod.getModifiers())) {
                    continue;
                }
                
                // Methods with @Transient annotation are not persistent
                if (isTransientAnnotationDefined(currMethod)) 
                    continue;

                var setMethod  = metadataHelper.getSetMethod(currMethod,classCurr);
                // If setMethod for the corresponding getMethod cannot be found, ignore the method
                if (setMethod == null) {
                    continue;
                }                                
                var setMethodName = setMethod.getName();

                
                // To be able to access the methods directly need to relax the Java language access checks
                if (java.lang.reflect.Modifier.isProtected(currMethod.getModifiers())) {
                    currMethod.setAccessible(true);
                }
                if (java.lang.reflect.Modifier.isProtected(setMethod.getModifiers())) {
                    setMethod.setAccessible(true);
                }
                
                var genType = currMethod.getGenericReturnType();
                var attrbName  = metadataHelper.getAttributeNameFromMethodName(currMethodName);
                var returnType = currMethod.getReturnType();
                //TODO:: need to solve for all cases 
                if (genType instanceof Packages.java.lang.reflect.ParameterizedType) {
                    var actTypeArgs = genType.getActualTypeArguments();
                    for (var ptype in actTypeArgs) {
                    }
                    returnType = genType.getRawType();
                    currCollClassType = actTypeArgs[0];
                } else if (genType instanceof Packages.java.lang.reflect.GenericArrayType) {
                } else if (genType instanceof Packages.java.lang.reflect.WildCardType) {
                } else if (genType instanceof Packages.java.lang.reflect.TypeVariable) {
                }

                var attributeInfo = new AttributeInfo();
                attributeInfo.fieldName    = attrbName;
                attributeInfo.fieldClass   = returnType;
                attributeInfo.collectionEntityClass = currCollClassType;
                attributeInfo.isPrimaryKey = false;
                attributeInfo.isInsertable = true;
                attributeInfo.isUpdateable = true;
                attributeInfo.owningEntity = entityInfo.javaClass;
                if (attrbName.equalsIgnoreCase(entityInfo.discrimCol)) {
                    attributeInfo.isInsertable = false;
                    attributeInfo.isUpdateable = false;                    
                }
                attributeInfo.valueInterface = new MethodValueInterface();
                attributeInfo.valueInterface.getMethod = currMethod;
                attributeInfo.valueInterface.setMethod = setMethod;                
                entityInfo.attributes[attrbName] = attributeInfo;
            }
        }
    } //processAllMethods
    
    function processAllFields(allFields,entityInfo) {
        var classCurr = entityInfo.javaClass;
        
        for (var m in allFields) {
            var currField     = allFields[m];
            var currFieldName = currField.getName();
            var currFieldType = currField.getType();
            var currCollClassType;

            // Fields with static, abstract, transient modifiers are not persistence fields
            if (java.lang.reflect.Modifier.isStatic(currField.getModifiers()) ||
                java.lang.reflect.Modifier.isTransient(currField.getModifiers()) ||
                java.lang.reflect.Modifier.isAbstract(currField.getModifiers())) {
                continue;
            }
            
            // Additionally fields with @javax.persistence.Transient annotation are not persistence fields
            if (isTransientAnnotationDefined(currField)) {
                continue;
            }
                     
            // Relax the java access checks to be able to directly use the field
            setAccessibleOnObject(currField);
            
            var genType = currField.getGenericType();
            
            //TODO:: need to solve for all cases 
            if (genType instanceof Packages.java.lang.reflect.ParameterizedType) {
                var actTypeArgs = genType.getActualTypeArguments();
                for (var ptype in actTypeArgs) {
                }
                currFieldType = genType.getRawType();
                currCollClassType = actTypeArgs[0];
            } else if (genType instanceof Packages.java.lang.reflect.GenericArrayType) {
            } else if (genType instanceof Packages.java.lang.reflect.WildCardType) {
            } else if (genType instanceof Packages.java.lang.reflect.TypeVariable) {
            } 
    
            var attributeInfo = new AttributeInfo();
            attributeInfo.fieldName    = currFieldName;
            attributeInfo.fieldClass   = currFieldType;
            attributeInfo.collectionEntityClass = currCollClassType;
            attributeInfo.isPrimaryKey = false;
            attributeInfo.isInsertable = true;
            attributeInfo.isUpdateable = true;
            attributeInfo.owningEntity = entityInfo.javaClass;
            if (currFieldName.equalsIgnoreCase(entityInfo.discrimCol)) {
                attributeInfo.isInsertable = false;
                attributeInfo.isUpdateable = false;                    
            }
                       
            attributeInfo.valueInterface = new FieldValueInterface();
            attributeInfo.valueInterface.field = currField;

            entityInfo.attributes[currFieldName] = attributeInfo;
        }
    } //processAllFields
    
    // To be able to access the fields directly need to relax the Java language access checks
    function setAccessibleOnObject(currField) {
        var currFieldModifiers = currField.getModifiers();
        if (!java.lang.reflect.Modifier.isAbstract(currFieldModifiers)     &&
            !java.lang.reflect.Modifier.isFinal(currFieldModifiers)        &&
            !java.lang.reflect.Modifier.isInterface(currFieldModifiers)    &&
            !java.lang.reflect.Modifier.isNative(currFieldModifiers)       &&
            !java.lang.reflect.Modifier.isPublic(currFieldModifiers)       &&
            !java.lang.reflect.Modifier.isStatic(currFieldModifiers)       &&
            !java.lang.reflect.Modifier.isStrict(currFieldModifiers)       &&
            !java.lang.reflect.Modifier.isSynchronized(currFieldModifiers) &&
            !java.lang.reflect.Modifier.isTransient(currFieldModifiers)    &&
            !java.lang.reflect.Modifier.isVolatile(currFieldModifiers)     ) {

            // This implies that the modifier is one among private/protected/package-private
            currField.setAccessible(true);
        }
    } //setAccessibleOnObject

    function isTransientAnnotationDefined(currObject) {
       var transientAnnotation = Packages.java.lang.Class.forName("javax.persistence.Transient");
       return currObject.isAnnotationPresent(transientAnnotation);
    } //isTransientAnnotationDefined
    
    /**
     * Process relationship annotations that might be defined in an Entity class. These annotations could
     * be either defined on the attribute or on the getMethod.
     * TODO::: Revisit this code as the IF loops are ugly
     * This function returns an Array containing information related to the specified class
     *
     */
    function processFieldMethodAnnotations(entityInfo,allClassesInfo) {
        var currObject;

        // Look at each method to check if we have an annotation defined on it. Based on the 
        // annotation update information on the attribute associated with that method.
        for (var attrb in entityInfo.attributes) {
            var currAttribute = entityInfo.attributes[attrb];
            if (currAttribute.valueInterface.getMethod != undefined) {
                currObject  = currAttribute.valueInterface.getMethod;
            } else if (currAttribute.valueInterface.field != undefined) {
                currObject  = currAttribute.valueInterface.field;
            }
            var annotations = currObject.getAnnotations();
            processAnnotations(currAttribute,annotations,currObject,allClassesInfo,entityInfo);
            entityInfo.attributes[attrb] = currAttribute;
        } //process each attribute
    } //processFieldMethodAnnotations

    function processAnnotations(currAttribute,annotations,currObject,allClassesInfo,entityInfo) {
        var annotationType;
        for (var annotate in annotations) {
            annotationType = annotations[annotate].annotationType();
            processColumnAnnotation(annotationType,currAttribute,currObject);
            processIdAnnotation(annotationType,currAttribute,currObject);
            processGeneratedValueAnnotation(annotationType,currAttribute,currObject);
            processVersionAnnotation(annotationType,currAttribute,currObject);            
            processOneToOneAnnotation(annotationType,currAttribute,currObject);
            processOneToManyAnnotation(annotationType,currAttribute,currObject);
            processManyToOneAnnotation(annotationType,currAttribute,currObject);
            processManyToManyAnnotation(annotationType,currAttribute,currObject);
            processEmbeddedAnnotation(annotationType,currAttribute,currObject,allClassesInfo,entityInfo);      
        } 
    } //processAnnotations
    
    function processColumnAnnotation(annotationType,currAttribute,currObject) {
        var annotationName = annotationType.getName();    
        if (annotationName == "javax.persistence.Column") {                
            var columnAnnotation = currObject.getAnnotation(Packages.javax.persistence.Column);
            // The order of the annotations is not guaranteed. So if the values of either insertable
            // or updateable is false, then it means the Id/GeneratedValue annotations have been processed
            // prior to Column annotation processing.
            if (currAttribute.isInsertable) {
                currAttribute.isInsertable = columnAnnotation.insertable();
            }
            if (currAttribute.isUpdateable) {
                currAttribute.isUpdateable = columnAnnotation.updatable();
            }
        }          
    } //processColumnAnnotation
    
    function processIdAnnotation(annotationType,currAttribute,currObject) {
        var annotationName = annotationType.getName();
        if (annotationName == "javax.persistence.Id") {
            currAttribute.isPrimaryKey = true;
            currAttribute.isUpdateable = false; 
        }        
    } //processIdAnnotation
    
    function processGeneratedValueAnnotation(annotationType,currAttribute,currObject) {
        var annotationName = annotationType.getName();
        if (annotationName == "javax.persistence.GeneratedValue") { 
            currAttribute.isInsertable = false;
        }
    }    
    
    function processVersionAnnotation(annotationType,currAttribute,currObject) {
        var annotationName = annotationType.getName();
        if (annotationName == "javax.persistence.Version") {
            currAttribute.isInsertable = false;
            currAttribute.isUpdateable = false;
        }
    } //processVersionAnnotation

        
    function processOneToOneAnnotation(annotationType,currAttribute,currObject) {
        var rel = null;
        var annotationName  = annotationType.getName();       
        if (annotationName  == "javax.persistence.OneToOne") {
            rel = new OneToOne;
            processRelationshipAnnotation(currAttribute,currObject,annotationType,rel,
                Packages.javax.persistence.OneToOne,true);
            currAttribute.mapping = rel; 
        }       
    } //processOneToOneAnnotation

    function processOneToManyAnnotation(annotationType,currAttribute,currObject) {
        var rel = null;
        var annotationName  = annotationType.getName();         
        if (annotationName == "javax.persistence.OneToMany") {
            rel = new OneToMany;
            processRelationshipAnnotation(currAttribute,currObject,annotationType,rel,
                Packages.javax.persistence.OneToMany,true);
            processOrderByAnnotation(currObject,rel);
            currAttribute.mapping = rel; 
        }   
    } //processOneToManyAnnotation

    function processManyToOneAnnotation(annotationType,currAttribute,currObject) {
        var rel = null;
        var annotationName  = annotationType.getName();       
        if (annotationName == "javax.persistence.ManyToOne") {
            rel  = new ManyToOne;
            processRelationshipAnnotation(currAttribute,currObject,annotationType,rel,
                Packages.javax.persistence.ManyToOne,false);
            currAttribute.mapping = rel;  
        }      
    } //processManyToOneAnnotation
    
    function processManyToManyAnnotation(annotationType,currAttribute,currObject) {
        var rel = null;
        var annotationName  = annotationType.getName();
        if (annotationName == "javax.persistence.ManyToMany") {
            rel = new ManyToMany;
            processRelationshipAnnotation(currAttribute,currObject,annotationType,rel,
                Packages.javax.persistence.ManyToMany,true);
            processOrderByAnnotation(currObject,rel);
            currAttribute.mapping = rel;
        }
    } //processManyToManyAnnotation
    
    function processRelationshipAnnotation(currAttribute,currObject,annotationType,rel,annotationClass,isMappedBy) {
        rel.isOwner     = true;
        annotationType  = currObject.getAnnotation(annotationClass);
        if (isMappedBy) {
            rel.mappedBy    = annotationType.mappedBy();
            if (rel.mappedBy.length() > 0) {
                rel.isOwner = false;
            }
        }
        rel.targetClass = annotationType.targetEntity();
        if (rel.targetClass.getName() == "void") {
            var genericType;
            if (currObject.getClass().getName().equals("java.lang.reflect.Field")) {
                genericType = currObject.getGenericType();
            } else {
                genericType = currObject.getGenericReturnType();
            }
            if (genericType instanceof Packages.java.lang.reflect.ParameterizedType) {
                rel.targetClass = genericType.getRawType(); //would return "interface java.util.Collection"
                rel.entityClass = currAttribute.collectionEntityClass;
            } else {
                rel.targetClass = currAttribute.fieldClass;
            }
        }
    } //processRelationshipAnnotation

    function processOrderByAnnotation(currObject,rel) {
        var orderByAnnotateClass = Packages.javax.persistence.OrderBy;
        if (currObject.isAnnotationPresent(orderByAnnotateClass)) {
            var orderBy = currObject.getAnnotation(orderByAnnotateClass);
            var orderByClause = orderBy.value();
            if (orderByClause.length() == 0) {
                rel.orderByClause = "ASC";
            } else {
                var strlen  = orderByClause.length();
                var tempStr = orderByClause.toLowerCase();
                var occur   = tempStr.lastIndexOf(" asc");
                if (occur == -1) {
                    occur = tempStr.lastIndexOf(" desc");
                }
                if (occur == -1) {
                    orderByClause += " ASC";
                }
                rel.orderByClause = orderByClause;
            }
        }
    } //processOrderByAnnotation

    function processEmbeddedAnnotation(annotationType,currAttribute,currObject,allClassesInfo,callerInfo) {
        var embeddedAttrb = Packages.javax.persistence.Embedded;
        if (currObject.isAnnotationPresent(embeddedAttrb)) {
            var displayName   = currAttribute.fieldClass.getSimpleName();
            var embEntityInfo = new EntityInfo();
            embEntityInfo.accessType     = callerInfo.accessType;
            embEntityInfo.discrimCol     = callerInfo.discrimCol;
            embEntityInfo.jpaTableName   = callerInfo.jpaTableName;
            embEntityInfo.displayName    = displayName;
            embEntityInfo.attributes     = {};
            embEntityInfo.persistentType = "embeddable";
            allClassesInfo[displayName.toLowerCase()]  = embEntityInfo;
            
            var rel = new Embedded;
            rel.targetClass = currAttribute.fieldClass;
            rel.isOwner     = true;
            currAttribute.mapping = rel;
        }
    } //processEmbeddedAnnotation
    
    /**
     * Provided a persistence unit name get a hold of the EntityManager. As per JPA one needs the 
     * EntityManager to initiate actions against the backend database.
     *
     * This function returns an EntityManager 
     *
     */
     this.getEntityManager = function(puName) {
        var emf = Packages.javax.persistence.Persistence.createEntityManagerFactory(puName, null);
        var em = emf.createEntityManager();

        return em;
    } //getEntityManager
    
    function getAnnotatedNameForEntity(entityClass) {        
        // If there is an annotation on the Entity class where the user has defined a name, 
        // that would be the display name for the entity
        var displayName = new java.lang.String("");
        displayName = entityClass.getAnnotation(Packages.javax.persistence.Entity).name();
        return displayName;
    } //getAnnotatedNameForEntity
    
    function getEntityDisplayName(entityClass) {
        // Check if the user has defined name with the @Entity annotation 
        var displayName = getAnnotatedNameForEntity(entityClass);
        if (displayName.length () == 0) {
            displayName = entityClass.getSimpleName();
        }
        return displayName;
    }
  
    /**
     * Get all fields for specified entity class. Returns array of AttributeInfoColumns
     *
     * returns:
     * [{AttributeInfo},{AttributeInfo},...]
     *
     */
    function getAllFieldsForClass(classesInfo, className) {
        var fields     = [];
        var attrbIndex = 0;
    
        for( var attrb in classesInfo[className.toLowerCase()].attributes) {
            fields[attrbIndex++] = classesInfo[className.toLowerCase()].attributes[attrb];
        }
        return fields;
    }
        
    /**
     * Function to return the attribute name that is marked as the primary key for this entity
     * The entity class could have a simple primary field or a compount PK.
     */
    function getPKAttributeNames(attributes) {
        var pkAttrbNames = [];
        for (var colName in attributes) {
            if (attributes[colName].isPrimaryKey) {
                pkAttrbNames.push(colName);
            }
        }
        return pkAttrbNames;
    }
    
    /**
     * Function to return all the non PK attribute names for an entityClass. 
     */
    function getNonPKAttributeNames(attributes) {
        var nonpkAttrbNames = [];
        for (var colName in attributes) {
            if (!attributes[colName].isPrimaryKey) {
                nonpkAttrbNames.push(colName);
            }
        }
        return nonpkAttrbNames;
    }
    
    function capitalize(s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    } //capitalize

/* ******************************************************************
 *
 * The Javascript Objects that store information for each Entity and 
 * its attribute.
 *
 * ******************************************************************
 */
    function EntityInfo() {
        this.javaClass;      // JavaClass associated with this entity
        this.accessType;     // Access Type of the class: "field" or "property"
        this.displayName;    // Name associated with this entity
        this.jpaTableName;   // Name to be used for JPA interaction
        this.attributes;     // Map of AttributeInfo objects
        this.discrimCol;     // Name of the Discriminator Column for Inheritance
        this.idClass;        // The IdClass associated with this entity
        this.persistentType; // the type of the class - Entity/Embeddedable/MappedSuperClass/IdClass
    }
    
    function AttributeInfo() {
        this.fieldName;
        this.fieldClass;            // java.lang.Class
        this.collectionEntityClass; // Entity class if this is a collection
        this.isPrimaryKey;
        this.isInsertable;
        this.isUpdateable;
        this.owningEntity;          // Entity class that owns this attribute. 
        this.mapping;               // Contains information about relationships
        this.valueInterface;        // Delegate to get/set Values
    }
    
    function FieldValueInterface() {
        this.field;     // java.lang.reflect.Field
    }
    
    function MethodValueInterface() {
        this.getMethod; // java.lang.reflect.Method
        this.setMethod; // java.lang.reflect.Method
    }
    
    function RelMapping() {
        this.targetClass;
        this.isOwner;
        this.value;
    }
    
    function OneToOne() {
        this.relName = 'onetoone';
        this.mappedBy;
    }
    OneToOne.prototype = new RelMapping();
    
    function OneToMany() {
        this.relName = 'onetomany';
        this.mappedBy;
        this.entityClass;
    }
    OneToMany.prototype = new RelMapping();
    
    function ManyToOne() {
        this.relName = 'manytoone';
    }
    ManyToOne.prototype = new RelMapping();
    
    function ManyToMany() {
        this.relName = 'manytomany';
        this.mappedBy;
        this.entityClass;
    }
    ManyToMany.prototype = new RelMapping();
    
    function Embedded() {
        this.relName = 'embedded';
    }
    Embedded.prototype = new RelMapping();

/* ******************************************************************
 *
 * The functions that are called to write out the modules and views
 * These functions are called from 
 * framework/systemApps/controller/jpagenerator.js.
 *
 * ******************************************************************
 */
    // String that contains all the column names of this entity
    this.getEntityColumnNames = function(attributes) { 
        var columnNames = new String("");
        for (var attrb in attributes) {
            if (columnNames.length > 0) {
                columnNames = columnNames.concat("\",\"");
            }
            columnNames = columnNames.concat(String(attributes[attrb].fieldName));
        }
        return columnNames;
    } //getEntityColumnNames
    
    this.getPrimaryKeyAttrbNames = function(attributes) {
        var pkAttrbNames = getPKAttributeNames(attributes);
        var pkNamesStr = new String("");
        pkNamesStr = pkNamesStr.concat("[");
        for (var pkNm in pkAttrbNames) {
            if (pkNamesStr.length > 1) {
                pkNamesStr = pkNamesStr.concat(",");
            }
            pkNamesStr = pkNamesStr.concat("\"",pkAttrbNames[pkNm],"\"");
        }
        pkNamesStr = pkNamesStr.concat("]");

        return pkNamesStr;
    } //getPrimaryKeyAttrbNames

    this.getNonPrimaryKeyAttrbNames = function(attributes) {
        var nonpkAttrbNames = getNonPKAttributeNames(attributes);
        var nonpkNamesStr = new String("");
        nonpkNamesStr = nonpkNamesStr.concat("[");
        for (var nonpkNm in nonpkAttrbNames) {
            if (nonpkNamesStr.length > 1) {
                nonpkNamesStr = nonpkNamesStr.concat(",");
            }
            nonpkNamesStr = nonpkNamesStr.concat("\"",nonpkAttrbNames[nonpkNm],"\"");
        }
        nonpkNamesStr = nonpkNamesStr.concat("]");

        return nonpkNamesStr;
    } //getNonPrimaryKeyAttrbNames
 
    this.prepareRelationshipsForEntityModule = function(attributes,puname,classname,entities) {
        var relText = String("");
        var nonpkAttrbNames = getNonPKAttributeNames(attributes);
        for (var n in nonpkAttrbNames) {
            var colName = nonpkAttrbNames[n];
            var relInfo = attributes[colName].mapping;

            var strbuf = String("");
            var dispStrbuf = String("");
            var nonPKStrbuf = String("");
            var idStrbuf = String("");
            var isCollection = false;
            if (relInfo != undefined) {
                if (relInfo.relName == 'embedded') {
                    //TODO:: Deal with EMBEDDED 
                } else { // all other relationships other than Embedded
                    var trgtCl         = relInfo.targetClass;
                    if (trgtCl.getName().equals("java.util.Collection") ||
                        trgtCl.getName().equals("java.util.Set")) {
                        isCollection = true;
                        trgtCl = relInfo.entityClass;
                    }

                    var trgtClName     = trgtCl.getSimpleName();
                    var trgtEntityInfo = entities[trgtClName.toLowerCase()];
                    strbuf = strbuf.concat("\"",colName,"\":","\n\t\t\t","{");
                    var tmpEntityname = trgtClName.toLowerCase();
                    var tmpClassname     = tmpEntityname.substring(0,1).toUpperCase() 
                                            + tmpEntityname.substring(1);
                    var moduleNmbuf = String("").concat("\n\t\t\t",
                            " \"moduleName\":\"",tmpEntityname,"\"");
                    var moduleClNmbuf = String("").concat("\n\t\t\t",
                            ", \"moduleClassName\":\"",tmpClassname,"\"");
                    strbuf = strbuf.concat(moduleNmbuf,moduleClNmbuf);
                    strbuf = strbuf.concat("\n\t\t\t",", \"isOwner\":",relInfo.isOwner);
                    strbuf = strbuf.concat("\n\t\t\t",", \"isCollection\":",isCollection);
                } //All relationsOtherThan Embedded
            } //relInfo != undefined
            if (strbuf.length > 1) {
                if (relText.length > 1) {
                    relText = relText.concat("\n\t\t",", ",strbuf,"\n\t\t\t","}");
                } else {
                    relText = relText.concat("{","\n\t\t",strbuf,"\n\t\t\t","}");
                }
            }
        } // for (..nonpkAttrbNames)
        var returnStrbuf = String("");
        if (relText.length > 1) {
            relText = relText.concat("\n\t\t","};");   
            returnStrbuf = returnStrbuf.concat("\n    ","this.",classname,".prototype.relations = ",relText);
        }

        return returnStrbuf;
    } //prepareRelationshipsForEntityModule
    
    /**
     * Prepare a Javascript object that would point to the appropriate Java method or field object.
     * This is needed where one does not have permission to directly call getter or setter methods
     * on the java Entity object. 
     * This function would return a javascript object in the following cases :
     * - Entity has Method level accessibility and there are some methods defined as protected
     * OR 
     * - Entity has Field level accessibility and there are some fields defined as private or protected
     * 
     * In either of these cases, get a hold of the correct java object, call setAccessible(true) on it
     * at the time of the javascript module instantiation. Then each set or get call will just get a hold
     * of this java object and use the entity object that is passed in.
     *
     * Returns a string of the format { "fieldName": javaField with accessibility set, }
     */
    this.prepareJavaAccessorForEntityModule = function(classname,attributes,entityInfo) {
        var javaObjectStr = String("");
        var headerStr = String("").concat("this.",classname,".prototype.");
        var commonStr = new String("    ").concat(headerStr);
        for (var attrb in attributes) {
            var currAttribute = attributes[attrb];
            var attrbName = currAttribute.fieldName;
 
            if (currAttribute.valueInterface.getMethod != undefined) {
                var currMethod = currAttribute.valueInterface.getMethod;
                var currMethodModifiers = currMethod.modifiers;
                if (java.lang.reflect.Modifier.isProtected(currMethodModifiers)) {                    
                    attrbStr = String("\n").concat(commonStr,attrbName,"GetObj = java.lang.Class.forName(\"",
                        currAttribute.owningEntity.getName(),"\")",".getDeclaredField(\"",currMethod.getName(),"\");");
                    attrbStr = attrbStr.concat("\n",commonStr,attrbName,"GetObj.setAccessible(true);");
                    javaObjectStr = javaObjectStr.concat(attrbStr);
                }
            } else if (currAttribute.valueInterface.field != undefined) {
                var currField = currAttribute.valueInterface.field;
                var currFieldModifiers = currField.modifiers;        
                if (java.lang.reflect.Modifier.isProtected(currFieldModifiers) ||
                    java.lang.reflect.Modifier.isPrivate(currFieldModifiers)    ) {
                    attrbStr = String("\n").concat(commonStr,attrbName,"Obj = java.lang.Class.forName(\"",
                        currAttribute.owningEntity.getName(),"\")",".getDeclaredField(\"",currField.getName(),"\");");
                    attrbStr = attrbStr.concat("\n",commonStr,attrbName,"Obj.setAccessible(true);");
                    javaObjectStr = javaObjectStr.concat(attrbStr);
                }
            }
        }
        return javaObjectStr;
    } //prepareJavaAccessorForEntityModule
    
    this.prepareMethodsForEntityModule = function(attributes,puname,classname) {
        var modelStr = new String("this." + classname + ".prototype");
        var funcStr = new String(" = function\(");
        var strbuf = String("");
        var insertStr = String("");
        var inputObjectStr = String("");
        for (var attrb in attributes) {
            var currAttribute = attributes[attrb];
            var attrbName = currAttribute.fieldName;
            var isRelationField = false;
            strbuf = strbuf.concat("\n    ", modelStr);
            strbuf = strbuf.concat(".get",capitalize(attrbName),funcStr,") \{");

            if (currAttribute.valueInterface.getMethod != undefined) {
                strbuf = checkMethodAccessibility(currAttribute.valueInterface.getMethod,"get",null,null,strbuf);
            } else if (currAttribute.valueInterface.field != undefined) {
                strbuf = checkFieldAccessibility(currAttribute,"get",attrbName,strbuf);
            }

            strbuf = strbuf.concat("\n    \}");

            if (currAttribute.isInsertable) {
                strbuf = strbuf.concat("\n    ", modelStr);
                strbuf = strbuf.concat(".set",capitalize(attrbName),funcStr,attrbName,") \{");

                if (insertStr.length > 1) {
                    insertStr = insertStr.concat(" else if (attrbName.equals(\"",attrbName,"\")) {");
                } else {                
                    insertStr = insertStr.concat("\n\t    ","if (attrbName.equals(\"",attrbName,"\")) {");
                }

                if (currAttribute.valueInterface.setMethod != undefined) {
                    strbuf = checkMethodAccessibility(currAttribute.valueInterface.setMethod,"set",attrbName,currAttribute.fieldClass,strbuf);               
                } else if (currAttribute.valueInterface.field != undefined) {
                    strbuf = checkFieldAccessibility(currAttribute,"set",attrbName,strbuf);
                }

                insertStr = insertStr.concat("\n\t        ","this.set",capitalize(attrbName),"(inputObjectValue);");
                insertStr = insertStr.concat("\n\t    ","}");
        
                var relInfo = currAttribute.mapping;
                if (relInfo != undefined) {
                    isRelationField = relInfo.isOwner;
                }
                strbuf         = strbuf.concat("\n    \}\n");
            } //isInsertable
            if (inputObjectStr.length > 1) {
                inputObjectStr = inputObjectStr.concat(" else if (attrbName.equals(\"",attrbName,"\")) {");
            } else {                
                inputObjectStr = inputObjectStr.concat("\n\t","if (attrbName.equals(\"",attrbName,"\")) {");
            }

            inputObjectStr = generateInputObjectValueForEntity(currAttribute,inputObjectStr,isRelationField,puname);
            inputObjectStr = inputObjectStr.concat("\n\t","}");
        }
        
        // Add to this string buffer the InsertMethod related String
        strbuf = strbuf.concat("\n","    this." + classname + ".prototype.getObjectForInputValue = function(attrbName,inputValue) {");
        strbuf = strbuf.concat("\n\t","var inputObjectValue;");
        strbuf = strbuf.concat("\n\t","if (inputValue == undefined ||");
        strbuf = strbuf.concat("\n\t    ","(inputValue instanceof java.lang.String && inputValue.length() < 1) ||");
        strbuf = strbuf.concat("\n\t    ","(inputValue instanceof java.lang.Number && inputValue.toString().length() < 1)) {");        
        strbuf = strbuf.concat("\n\t    "," return;");
        strbuf = strbuf.concat("\n\t","}");
        strbuf = strbuf.concat("\n",inputObjectStr);
        strbuf = strbuf.concat("\n\t","return inputObjectValue");
        strbuf = strbuf.concat("\n","    } //getObjectForInputValue\n");   
        
        strbuf = strbuf.concat("\n","    /*");
        strbuf = strbuf.concat("\n","    * The inputValues is a Javascript object with values as a JavaArray. ");
        strbuf = strbuf.concat("\n","    * In case of relationships there could be multiple values selected by the user and the");
        strbuf = strbuf.concat("\n","    * the value would be a String[] containg the pK value of each entry selected in the form");
        strbuf = strbuf.concat("\n","    * \"pkName1=pkVal1\",\"pkName2=pkVal2\"...");
        strbuf = strbuf.concat("\n","    */");
        strbuf = strbuf.concat("\n","    this." + classname + ".prototype.updateValuesIntoEntityObject = function(inputValues) {");
        strbuf = strbuf.concat("\n\t","for (var attrbName in inputValues) {");
        strbuf = strbuf.concat("\n\t    ","var inVal = inputValues[attrbName];");
        strbuf = strbuf.concat("\n\t    ","var inputValue;");
        strbuf = strbuf.concat("\n\t    ","if (inVal.length == 1) {");
        strbuf = strbuf.concat("\n\t        ","inputValue = String(inVal[0]);");
        strbuf = strbuf.concat("\n\t    ","} else {");
        strbuf = strbuf.concat("\n\t        ","inputValue = inVal;");
        strbuf = strbuf.concat("\n\t    ","}");
        strbuf = strbuf.concat("\n\t    ","// If the user has not entered any value for this field then skip this");
        strbuf = strbuf.concat("\n\t    ","// field for insert & update");
        strbuf = strbuf.concat("\n\t    ","if (inputValue.length < 1) {");
        strbuf = strbuf.concat("\n\t        ","continue;");
        strbuf = strbuf.concat("\n\t    ","}");
        strbuf = strbuf.concat("\n\t    ","// Convert the value from a String to a java type expected by the Entity field");
        strbuf = strbuf.concat("\n\t    ","var inputObjectValue = this.getObjectForInputValue(attrbName,inputValue);");
        strbuf = strbuf.concat("\n\t",insertStr);
        strbuf = strbuf.concat("\n\t","}");
        strbuf = strbuf.concat("\n","    } //updateValuesIntoEntityObject\n");
        
        return strbuf.toString();
    } //prepareMethodsForEntityModule
     
    this.prepareOnLoadForEditView = function(attributes,hasRelations) {
        var strbuf = String("");
        if (hasRelations) {
            strbuf = strbuf.concat("<body onload=\"processRelations()\">"); 
            strbuf = strbuf.concat("\n\t","<script type=\"text/javascript\">");
            strbuf = strbuf.concat("\n\t","function processRelations() {");
            strbuf = strbuf.concat("\n\t    ","var resultsList = <%= library.json.serialize(library.jpahelper.prepareRelationsResultList(model.clazz)) %>;");
            strbuf = strbuf.concat("\n\t    ","var relations = <%= library.json.serialize(model.clazz.relations) %>;");
            strbuf = strbuf.concat("\n\t    ","var instance = <%= library.json.serialize(library.jpahelper.getValueArray(model.clazz)) %>;");
            strbuf = strbuf.concat("\n\t    ","for (var n in resultsList) {");
            strbuf = strbuf.concat("\n\t        ","var resultArray = resultsList[n];");
            strbuf = strbuf.concat("\n\t        ","if (!relations[n].isOwner) {");
            strbuf = strbuf.concat("\n\t            ","continue;");
            strbuf = strbuf.concat("\n\t        ","}");
            strbuf = strbuf.concat("\n\t        ","var currFieldValue = (document.getElementById(n + '_hidden').value).split('$_%');");
            strbuf = strbuf.concat("\n\t        ","for (var rsltRow in resultArray) {");
            strbuf = strbuf.concat("\n\t            ","var rsltArrayRow = resultArray[rsltRow];");
            strbuf = strbuf.concat("\n\t            ","var optVal = rsltArrayRow[0];");
            strbuf = strbuf.concat("\n\t            ","var optTxt = rsltArrayRow[1];");
            strbuf = strbuf.concat("\n\t            ","var opt;");
            strbuf = strbuf.concat("\n\t            ","if (currFieldValue.length == 0) { //Create case");
            strbuf = strbuf.concat("\n\t                ","opt = new Option(optTxt,optVal,false);");
            strbuf = strbuf.concat("\n\t                ","document.getElementById(n).options[document.getElementById(n).options.length] = opt;");
            strbuf = strbuf.concat("\n\t            ","} else { //Edit case");
            strbuf = strbuf.concat("\n\t                ","for (var idx in currFieldValue) {");
            strbuf = strbuf.concat("\n\t                    ","if (optVal == currFieldValue[idx]) {");        
            strbuf = strbuf.concat("\n\t                        ","opt = new Option(optTxt,optVal,true);");
            strbuf = strbuf.concat("\n\t                        ","break;");
            strbuf = strbuf.concat("\n\t                    ","} else {");
            strbuf = strbuf.concat("\n\t                        ","opt = new Option(optTxt,optVal,false);");
            strbuf = strbuf.concat("\n\t                    ","}");
            strbuf = strbuf.concat("\n\t                ","}");
            strbuf = strbuf.concat("\n\t                ","document.getElementById(n).options[document.getElementById(n).options.length] = opt;");
            strbuf = strbuf.concat("\n\t            ","}");
            strbuf = strbuf.concat("\n\t        ","} //for rsltRow in resultArray");
            strbuf = strbuf.concat("\n\t    ","} //for n in resultsList");
            strbuf = strbuf.concat("\n\t","} //processRelations");

            strbuf = strbuf.concat("\n\t","</script>");
        } else {
            strbuf = strbuf.concat("<body>");
        }
        return strbuf;
    } //prepareOnLoadForEditView

    this.generateHtmlForEditView = function(attributes) {
        var editStr = new String("");
        var typ = "text";
        var siz = 50;
        var currValue = new String("");
        
        // First get the array of primary key fields
        var pkAttrbNames = getPKAttributeNames(attributes); 
        for (var pkNm in pkAttrbNames) {
            var pkAttrbName = pkAttrbNames[pkNm];
            var pkcolInfo = attributes[pkAttrbName];
            if (pkcolInfo.isInsertable) {
                editStr = writeHtmlForAttrb(editStr,pkAttrbName,typ,siz,false,
                    currValue,"");
            } else {
                editStr = writeHtmlForAttrb(editStr,pkAttrbName,typ,siz,true,
                    currValue,"Primary Key field value is being autogenerated ");
            }
        }
        var nonpkAttrbNames = getNonPKAttributeNames(attributes); 
        for (var n in nonpkAttrbNames) {
            var colName = nonpkAttrbNames[n];
            var colInfo = attributes[colName];
            var mapping = colInfo.mapping;

            if (mapping == undefined) {
                if (colInfo.fieldClass.getName().equals("java.util.Date")) {
                    if (colInfo.isInsertable) {
                        editStr = editStr.concat("\n\t\t","<p><b>",colName,"</b><br>");
                        editStr = editStr.concat("\n\t\t","<input id=\"",colName,
                            "\" name=\"",colName,"\"", 
                            " type=\"text\"/>","\n");
/*
                        editStr = editStr.concat("\n\t\t<% library.jmaki.insert({",
                            "component:\"dojo.dropdowndatepicker\",id:\"", 
                            colName,
                            "}); %> \n");
*/
                        editStr = editStr.concat("\n\t\t","<script language=\"Javascript\">",
                            "\n\t\t\t","dojo.require(\"dojo.widget.DropdownDatePicker\");",
                            "\n\t\t\t","dojo.widget.createWidget(\"DropdownDatePicker\", ",
                            "\n\t\t\t\t","{ inputId: \"",colName,"\", inputName: \"",colName,"\"",
                            ", value: \"<%= inst[\"",colName,"\"] %>\"","},","\n\t\t\t\t",
                            "dojo.byId(\"",colName,"\"));",
                            "\n\t\t","</script>","\n");
                    } else {
                        editStr = writeHtmlForAttrb(editStr,colName,typ,siz,true,
                            currValue,"Field value is being autogenerated or is not insertable");
                    }
                } else {
                    if (colInfo.isInsertable) {
                        editStr = writeHtmlForAttrb(editStr,colName,typ,siz,false,
                            currValue,"");
                    } else {
                        editStr = writeHtmlForAttrb(editStr,colName,typ,siz,true
                            ,currValue,"Field value is being autogenerated or is not insertable");
                    }
                }
            } else { // mapping has been defined on this field
                var relInfo = mapping;
                if (relInfo.isOwner) {
                    if (relInfo.relName == 'embedded') {
                    } else { // all other relationships other than Embedded
                        editStr = editStr.concat("\n\t\t","<p><b>",colName,"</b><br>");
                        editStr = editStr.concat("\n\t\t","<input id=\"",colName
                            ,"_hidden\" type=\"hidden\"  value=\"<%= inst[\"",colName,"\"].toString() %>\">");
                        if (relInfo.relName == 'manytomany') {
                            editStr = editStr.concat("\n\t\t","<select id=\"",colName,"\" name=\"",colName
                                ,"\" size=5 multiple>","\n");
                        } else {
                            editStr = editStr.concat("\n\t\t","<select id=\"",colName,"\" name=\"",colName
                                ,"\" size=5>","\n");
                        }                        
                        editStr = editStr.concat("\n\t\t","</select>","<br>\n");
                    }
                }
           }
        } //for (..in nonpkAttrbNames)
        return editStr;
    } //generateHtmlForEditView

    /**
     * For each entity prepare an array of atmost 2 column names that would be used
     * to populate the listbox associated to a relationship. 
     */
    this.getDisplayRelFields = function(attributes) {
        var displayRelFields = [];
        for (var colName in attributes) {
            var currField = attributes[colName];
            if (currField.isPrimaryKey         ||
                currField.mapping != undefined ||
                colName == "version"           ||
                colName == "discriminator"     ) {
                    continue;
            } else {
                displayRelFields.push(colName);
            }
        }
        var displayRelStr = new String("[");
        if (displayRelFields[0] != undefined){
            displayRelStr = displayRelStr.concat("\"",displayRelFields[0],"\"");
        }
        if (displayRelFields[1] != undefined){
            displayRelStr = displayRelStr.concat(",","\"",displayRelFields[1],"\"");
        }
        displayRelStr = displayRelStr.concat("]");
        return displayRelStr;
    } //getDisplayRelFields
    
    /*
     *-----------------------------------------------------------------------------------------
     *
     *-----------------------------------------------------------------------------------------
     */
    
    function generateInputObjectValueForEntity(currAttribute,strbuf,isRelationField,puname) {
        var fieldClass = currAttribute.fieldClass;
        if (isRelationField) {
            var relInfo = currAttribute.mapping;
            fieldClass = relInfo.targetClass;
            if (fieldClass.getName().equals("java.util.Collection") ||
                fieldClass.getName().equals("java.util.Set")) {
                fieldClass = relInfo.entityClass;
                strbuf = strbuf.concat("\n\t    ","// is a collection of ",fieldClass.getName());
                strbuf = strbuf.concat("\n\t    ","var currFieldValue = this.get",capitalize(currAttribute.fieldName),"();");
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = ",
                    "library.jpahelper.getCollectionObjectValue(attrbName,inputValue,this,currFieldValue);");
            } else {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = ",
                    "library.jpahelper.getInstanceObjectOfRel(attrbName,inputValue,this);");
            }
        } else {
            if (fieldClass.getName().equals("char") ||
                fieldClass.getName().equals("java.lang.Character")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Character.valueOf(inputValue.charAt(0));");
            } else if (fieldClass.getName().equals("int") ||
                       fieldClass.getName().equals("java.lang.Integer")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Integer.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("long") ||
                       fieldClass.getName().equals("java.lang.Long")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Long.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("short") ||
                       fieldClass.getName().equals("java.lang.Short")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Short.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("byte") ||
                       fieldClass.getName().equals("java.lang.Byte")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Byte.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("float") ||
                       fieldClass.getName().equals("java.lang.Float")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Float.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("double") ||
                       fieldClass.getName().equals("java.lang.Double")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = java.lang.Double.valueOf(inputValue);");
            } else if (fieldClass.getName().equals("java.lang.String")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = new java.lang.String(inputValue);");
            } else if (fieldClass.getName().equals("java.math.BigInteger")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = new java.math.BigInteger(inputValue);");
            } else if (fieldClass.getName().equals("java.math.BigDecimal")) {
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = new java.math.BigDecimal(inputValue);");
            } else if (fieldClass.getName().equals("java.util.Date")) {
                strbuf = strbuf.concat("\n\t    ","var df = new java.text.SimpleDateFormat(\"MM/dd/yy\");");
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = df.parse(inputValue);");
            } else if (fieldClass.getName().equals("java.util.Calendar")) {
                //TODO:: provide implementation
            } else if (fieldClass.getName().equals("java.util.Collection") ||
                       fieldClass.getName().equals("java.util.Set")) {
                var relatedEntityClass = currAttribute.collectionEntityClass;
                strbuf = strbuf.concat("\n\t    ","// is a collection of ",relatedEntityClass.getName());
                strbuf = strbuf.concat("\n\t    ","var currFieldValue = this.get",capitalize(currAttribute.fieldName),"();");
                strbuf = strbuf.concat("\n\t    ","inputObjectValue = ",
                    "library.jpahelper.getCollectionObjectValue(attrbName,inputValue,this,currFieldValue);");
            }
        }

        return strbuf;
    } //generateInputObjectValueForEntity
    
    // Since the fields are obtained from the entityInfo, they would be either 
    // Public/Protected.
    function checkMethodAccessibility(currMethod,accessType,attrbName,fieldClass,strbuf) {
        var currMethodModifiers = currMethod.modifiers;
        if (java.lang.reflect.Modifier.isProtected(currMethodModifiers)) {
            if (accessType == "get") {
                strbuf = strbuf.concat("\n\t","return this.",currMethod.getName(),"GetObj.invoke(this.entityObj,null);");                
            } else if (accessType == "set") {
                strbuf = strbuf.concat("\n\t","var classArry = java.lang.reflect.Array.newInstance(java.lang.Class,1);");
                strbuf = strbuf.concat(generateParamClassTypeString(fieldClass)); 
                strbuf = strbuf.concat("\n\t","var currMethod = this.entityObj.getClass().getDeclaredMethod(\"",
                    currMethod.getName(),"\",classArry);");
                strbuf = strbuf.concat("\n\t","currMethod.setAccessible(true);");
                strbuf = strbuf.concat("\n\t","var objArry = java.lang.reflect.Array.newInstance(java.lang.Object,1);");
                strbuf = strbuf.concat("\n\t","objArry[0] = ",attrbName,";");
                strbuf = strbuf.concat("\n\t","return currMethod.invoke(this.entityObj,objArry);");
            }
        } else {
            if (accessType == "get") {                
                strbuf = strbuf.concat("\n\t","return this.entityObj.",currMethod.getName(),"();");
            } else if (accessType == "set") {
                strbuf = strbuf.concat("\n\t","return this.entityObj.",currMethod.getName(),"(",attrbName,");");
            }
        }
        return strbuf;
    } //checkMethodAccessibility
        
    // Since the fields are obtained from the entityInfo, they would be either 
    // Public/Protected/Private.
    function checkFieldAccessibility(currAttribute,accessType,attrbName,strbuf) {
        var currField = currAttribute.valueInterface.field;
        var currFieldModifiers = currField.modifiers;
        if (java.lang.reflect.Modifier.isProtected(currFieldModifiers) ||
           java.lang.reflect.Modifier.isPrivate(currFieldModifiers)    ) {
            // This implies that the modifier is one among private/protected/package-private
            var fieldStr = String("").concat("this.",attrbName,"Obj");
            if (accessType == "get") {
                strbuf = strbuf.concat("\n\t","return ",fieldStr,".get(this.entityObj);");
            } else if (accessType == "set") {
                strbuf = strbuf.concat("\n\t","return ",fieldStr,".set(this.entityObj,",attrbName,");");
            }
        } else {
            if (accessType == "get") {
                strbuf = strbuf.concat("\n\t","var returnVal = this.entityObj.",currField.getName(),";");
            } else if (accessType == "set") {
                strbuf = strbuf.concat("\n\t","return this.entityObj.",currField.getName()," = ",attrbName,";");
            }
        }
        
        return strbuf;
    } //checkFieldAccessibility

    function generateParamClassTypeString(fieldClass) {
        var strbuf = String("");
        var fieldClsName = fieldClass.getName();
            if (fieldClsName.equals("char")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Character.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Character")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Character;\n");
            } else if (fieldClsName.equals("int")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Integer.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Integer")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Integer;\n");
            } else if (fieldClsName.equals("long")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Long.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Long")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Long;\n");       
            } else if (fieldClsName.equals("short")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Short.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Short")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Short;\n");
            } else if (fieldClsName.equals("byte")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Byte.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Byte")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Byte;\n");
            } else if (fieldClsName.equals("float")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Float.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Float")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Float;\n");
            }  else if (fieldClsName.equals("double")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Double.TYPE;\n");
            } else if (fieldClass.getName().equals("java.lang.Double")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.Double;\n");
            } else if (fieldClass.getName().equals("java.lang.String")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.String;\n");
            } else if (fieldClass.getName().equals("java.lang.BigInteger")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.BigInteger;\n");
            } else if (fieldClass.getName().equals("java.lang.BigDecimal")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.lang.BigDecimal;\n");
            } else if (fieldClass.getName().equals("java.util.Date")) {
                strbuf = strbuf.concat("\t","classArry[0] = java.util.Date;\n");
            } else if (fieldClass.getName().equals("java.util.Calendar")) {
                //TODO:: provide implementation
            } // Also need to take care of Collections of Entities

        return strbuf;
    } //generateParamClassTypeString
  
    function writeHtmlForAttrb(htmlStr,attrbName,typ,siz,readOnly,currValue,toolTipStr) {
        if (htmlStr.length < 1) {
            htmlStr = htmlStr.concat("\t","<p><b>",attrbName,"</b><br>");
        } else {
            htmlStr = htmlStr.concat("\t\t","<p><b>",attrbName,"</b><br>");
        }
        if (currValue.length > 1) {
            htmlStr = htmlStr.concat("\n\t\t","<input id=\"" + attrbName,"_vid\"",
                            " name=\"",attrbName,"\"",
                            " type=\"",typ,"\"",
                            " size=\"",siz,"\"",
                            " value=\"",currValue,"\"");
        } else {
            htmlStr = htmlStr.concat("\n\t\t","<input id=\"" + attrbName,"_vid\"",
                            " name=\"",attrbName,"\"",
                            " type=\"",typ,"\"",
                            " size=\"",siz,"\"",
                            " value=\"<%= inst[\"",attrbName,"\"] %>\"");
        }
        if (readOnly) {
            htmlStr = htmlStr.concat(" readonly=readonly>");
        } else {
            htmlStr = htmlStr.concat(">");
        }
        htmlStr = htmlStr.concat("\n\t\t","</input>","<br>\n");
        if (toolTipStr != undefined && toolTipStr.length > 0) {
            htmlStr = htmlStr.concat("\t\t","<span dojoType=\"tooltip\" connectId=\"",
                attrbName,"_vid\" toggle=\"explode\">",toolTipStr,"</span>","\n");
        }
        return htmlStr;
    }

});
