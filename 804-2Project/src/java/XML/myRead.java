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

      docJDOM = bSAX.build(new File("C:/workSpace/804-2Project/web/label.xml"));//�d�ߦ����O�_�s�b

    }

    catch (JDOMException e) {

      e.printStackTrace();

      return;

    }

   

    Element elmtRoot = docJDOM.getRootElement();//���o�ڥؿ�����

    Element elmtChapter = new Element("label");//�гy�s����

    
   
    Attribute attribute1 = new Attribute("x",x);//���ͷs���ݩ�
    Attribute attribute2 = new Attribute("y",y);
    Attribute attribute3 = new Attribute("name",name);
  
   
    elmtChapter.addAttribute(attribute1);//�����e�������W�[�ݩ�
    elmtChapter.addAttribute(attribute2);
    elmtChapter.addAttribute(attribute3);
   
   
    elmtRoot.addContent(elmtChapter);
       
    OutputXML(docJDOM, "C:/workSpace/804-2Project/web/label.xml");//�N��諸���e��s�ܳo�ؿ������
    
    }
   
    
   
   
    private void OutputXML(Document docXML, String strFilename) {
   
   
   
    XMLOutputter fmt = new XMLOutputter();
   
    try {
     
     
     
      fmt.setEncoding("big5");
     
      fmt.setNewlines(true);//���ʹ���
     
      FileWriter fwXML = new FileWriter(strFilename);

      fmt.output(docXML, fwXML);

      fwXML.close();

    }

    catch (IOException e) {

      e.printStackTrace();

    }

  }
} 