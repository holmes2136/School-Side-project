
package Control;
import java.sql.*;
import Sql.*;
import java.util.*;

        
public class Control {
    Connection conn;
    sql sql = new sql();
    
    
    public Control() {
        conn = sql.getConnection();
    }
    
    
    public Collection leftGetAllArtical()throws Exception{
            Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from artical where replyid='"+0+"'"+"limit "+0+","+1);
        while(rs.next()){
            Artical artical = new Artical();
            artical.setTitleid(rs.getInt("titleid"));
            artical.setTitle(rs.getString("title"));
            artical.setContent(rs.getString("content"));
            artical.setAuthor(rs.getString("author"));
            artical.setCategory(rs.getString("category"));
            artical.setTime(rs.getString("time"));
            ret.add(artical);
        }
       
        return ret;
   
    }
    
    
    public Collection getAllArtical()throws Exception{//取得所有回覆文章
        Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from artical where replyid='"+0+"'"+" order by titleid asc");
        while(rs.next()){
            Artical artical = new Artical();
            artical.setTitleid(rs.getInt("titleid"));
            artical.setTitle(rs.getString("title"));
            artical.setContent(rs.getString("content"));
            artical.setAuthor(rs.getString("author"));
            artical.setCategory(rs.getString("category"));
            artical.setTime(rs.getString("time"));
            ret.add(artical);
        }
      
        return ret;
       
    }
    
    public Collection getNewArtical()throws Exception{
        Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from artical where replyid='"+0+"'"+"limit "+0+","+3);
        while(rs.next()){
            Artical artical = new Artical();
            artical.setTitleid(rs.getInt("titleid"));
            artical.setTitle(rs.getString("title"));
            artical.setContent(rs.getString("content"));
            artical.setAuthor(rs.getString("author"));
            artical.setCategory(rs.getString("category"));
            ret.add(artical);
        }
        
        return ret;
        
    }   
    
    
    public Collection getAllCategory()throws Exception{
            Collection ret = new ArrayList();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("select * from category");
            while(rs.next()){
                Category category = new Category();
                category.setCatid(rs.getString("catid"));
                category.setDescn(rs.getString("descn"));
                ret.add(category);
                
            
            }
             return ret;
           
            
            
    }
    
    public Collection getAllArticalByCategory(String categoryId)throws Exception{
            Collection ret = new ArrayList();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("select * from artical where category='"+categoryId+"'");
            while(rs.next()){
                Artical artical = new Artical();
                artical.setTitleid(rs.getInt("titleid"));
                artical.setTitle(rs.getString("title"));
                artical.setContent(rs.getString("content"));
                artical.setAuthor(rs.getString("author"));
                artical.setCategory(rs.getString("category"));
                ret.add(artical);
            }
           
            return ret;
    }
        //新增文章
        public void addNewTopic(Artical artical)throws Exception{
                PreparedStatement pstmt = conn.prepareStatement("insert into artical value(?,?,?,?,?,?,?)");
                pstmt.setInt(1,artical.getTitleid());
                pstmt.setString(2,artical.getTitle());
                pstmt.setString(3,artical.getContent());
                pstmt.setString(4,artical.getAuthor());
                pstmt.setString(5,artical.getCategory());
                pstmt.setString(6,artical.getTime());
                pstmt.setInt(7,artical.getReplyid());
                pstmt.execute();
                
        }
        //刪除分類
        public void deleteCategory(String[] catid)throws Exception{
                PreparedStatement pstmt = conn.prepareStatement("delete from category where catid = ?");
                for(int i=0;i<catid.length;i++){
                    pstmt.setString(1,catid[i]);
                    pstmt.execute();
                }
               
        }
        
        //新增分類
        public void addCategory(Category category)throws Exception{
                    PreparedStatement pstmt = conn.prepareStatement("insert into category values(?,?)");
                    pstmt.setString(1,category.getCatid());
                    pstmt.setString(2,category.getDescn());
                    pstmt.execute();
                  
        }
        
        public Artical getArticalDetail(String titleid)throws Exception{//傳入titleid取得詳細文章內容
                Artical artical = new Artical();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("select * from artical where titleid='"+titleid+"'");
                while(rs.next()){
                     
                        artical.setTitleid(rs.getInt("titleid"));
                        artical.setTitle(rs.getString("title"));
                        artical.setContent(rs.getString("content"));
                        artical.setAuthor(rs.getString("author"));
                        artical.setCategory(rs.getString("category"));
                        artical.setTime(rs.getString("time"));
                        artical.setReplyid(rs.getInt("replyid"));
                }
                 return artical;
                 
        }
        
        public Collection getAllReplyTopic(String titleid)throws Exception{
                Collection ret = new ArrayList();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("select * from artical where replyid='"+titleid+"'");
                while(rs.next()){
                        Artical artical = new Artical();
                        artical.setTitleid(rs.getInt("titleid"));
                        artical.setTitle(rs.getString("title"));
                        artical.setContent(rs.getString("content"));
                        artical.setAuthor(rs.getString("author"));
                        artical.setCategory(rs.getString("category"));
                        artical.setTime(rs.getString("time"));
                        ret.add(artical);
                }
                
                return ret;
        }
        
        public void updateTopic(Artical artical)throws Exception{
                PreparedStatement pstmt = conn.prepareStatement("update artical set title=?,content=?,category=? where titleid=?");
                pstmt.setString(1,artical.getTitle());
                pstmt.setString(2,artical.getContent());
                pstmt.setString(3,artical.getCategory());
                pstmt.setInt(4,artical.getTitleid());
                pstmt.execute();
                
        }
        
        
}
