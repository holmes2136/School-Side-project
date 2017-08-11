

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
    
    public int getRowCount()throws Exception{//�p��replyid=0���峹,�D�n��ܦb�����W�����峹,�]���`���ƥ����Hreplyid=0���峹���D�Ӥ��O�S�����󪺥�������
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select count(*) from artical where replyid='"+0+"'");
        while(rs.next()){
            this.rowCount = rs.getInt(1);
        }
        return rowCount;
    }
    
    public int getPageCount(){//���o�`����
        if(this.rowCount%this.rowsPerPage==0){
            this.pageCount = this.rowCount/this.rowsPerPage;
        }
        else{
            this.pageCount = this.rowCount/this.rowsPerPage+1;
        }
        return this.pageCount;
    }
    
    public Collection getPageData(int curPage)throws Exception{//���o�{�b�Ҧb���ƪ���� 
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
