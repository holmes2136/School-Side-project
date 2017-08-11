package XML;
import org.jdom.*;
import org.jdom.input.*;
import org.jdom.output.*;
import java.io.*;
import java.util.List;
import org.jdom.Element;


public class myRead {
   
    public myRead(){
    
    }
  
    public myRead(String x,String y,String name)throws Exception{
    Document docJDOM;
    SAXBuilder bSAX = new SAXBuilder(false);

    try {

      docJDOM = bSAX.build(new File("C:/workSpace/804-2Project/web/label.xml"));//查詢此文件是否存在

    }

    catch (JDOMException e) {

      e.printStackTrace();

      return;

    }

   

    Element elmtRoot = docJDOM.getRootElement();//取得根目錄元素

    Element elmtChapter = new Element("label");//創造新元素

    
   
    Attribute attribute1 = new Attribute("x",x);//產生新的屬性
    Attribute attribute2 = new Attribute("y",y);
    Attribute attribute3 = new Attribute("name",name);
  
   
    elmtChapter.addAttribute(attribute1);//替先前的元素增加屬性
    elmtChapter.addAttribute(attribute2);
    elmtChapter.addAttribute(attribute3);
   
   
    elmtRoot.addContent(elmtChapter);
       
    OutputXML(docJDOM, "C:/workSpace/804-2Project/web/label.xml");//將更改的內容更新至這目錄的文件
    
    }
   
    
   
   
    private void OutputXML(Document docXML, String strFilename) {
   
   
   
    XMLOutputter fmt = new XMLOutputter();
   
    try {
     
     
     
      fmt.setEncoding("big5");
     
      fmt.setNewlines(true);//產生換行
     
      FileWriter fwXML = new FileWriter(strFilename);

      fmt.output(docXML, fwXML);

      fwXML.close();

    }

    catch (IOException e) {

      e.printStackTrace();

    }

  }
} 