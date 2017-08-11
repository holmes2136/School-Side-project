
package Upload;


import java.io.*;

public class Control {
    
    
    public Control() {
    }
    
    public String FileExist(String path)throws Exception{
        String result = "";
        File file = new File(path);
        if(!file.exists()){
            
            result="";
        } else{
            
            result = "圖片已經存在";
            
        }
        return result;
    }
        
        
        public String pathConvert(String path){
            String path1 = path.replaceAll("//","/");
            int pathLen = path1.length();
            String path2 = path1.substring(30,pathLen);
            return path2;
       
        }
    
    
}
