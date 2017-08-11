

package Page;
import java.sql.*;
import java.util.*;
import Sql.sql;
import Control.*;

public class PageBean {
    sql sql = new sql();
    Connection conn ;
    int rowCount;
    int pageCount;
    int rowsPerPage = 5;
    
    public PageBean() {
        
        conn = sql.getConnection();
    }
    
    public int getRowCount()throws Exception{//計算replyid=0的文章,主要顯示在首頁上面的文章,因此總筆數必須以replyid=0的文章為主而不是沒有條件的全部筆數
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select count(*) from artical where replyid='"+0+"'");
        while(rs.next()){
            this.rowCount = rs.getInt(1);
        }
        return rowCount;
    }
    
    public int getPageCount(){//取得總頁數
        if(this.rowCount%this.rowsPerPage==0){
            this.pageCount = this.rowCount/this.rowsPerPage;
        }
        else{
            this.pageCount = this.rowCount/this.rowsPerPage+1;
        }
        return this.pageCount;
    }
    
    public Collection getPageData(int curPage)throws Exception{//取得現在所在頁數的資料 
            Collection ret = new ArrayList();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("select * from artical where replyid='"+0+"'"+" order by titleid desc"+" LIMIT "+((curPage-1)*rowsPerPage)+ "," +rowsPerPage);
            while(rs.next()){
                  Artical artical = new Artical();
                  artical.setTitleid(rs.getInt("titleid"));
                  artical.setTitle(rs.getString("title"));
                  artical.setContent(rs.getString("content"));
                  artical.setAuthor(rs.getString("author"));
                  artical.setCategory(rs.getString("category"));
                  artical.setTime(rs.getString("time"));
                  artical.setReplyid(rs.getInt("replyid"));
                  ret.add(artical);
            }
            return ret;
    }
}
