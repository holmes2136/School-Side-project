

package Image;
import java.sql.*;
import java.util.*;
import Sql.sql;

public class ImageControl {
    Connection conn;
    sql sql = new sql();
    
    public ImageControl() {
        conn = sql.getConnection();
    }
    
    
    public Collection getAllImage()throws Exception{
        Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from img");
        while(rs.next()){
            ImageVO image = new ImageVO();
            image.setId(rs.getInt("id"));
            image.setName(rs.getString("name"));
            image.setPath(rs.getString("path"));
            image.setDescn(rs.getString("descn"));
            ret.add(image);
        }
        
        return ret;
        
    }
    
    public void addImg(ImageVO img)throws Exception{
       PreparedStatement pstmt = conn.prepareStatement("insert into img values(?,?,?,?)");
       pstmt.setInt(1,img.getId());
       pstmt.setString(2,img.getName());
       pstmt.setString(3,img.getPath());
       pstmt.setString(4,img.getDescn());
       pstmt.execute();
    }
}
