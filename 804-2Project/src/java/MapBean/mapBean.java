
package MapBean;
import java.util.*;
import java.sql.*;
import Sql.*;

public class mapBean {
    sql sql = new sql();
    Connection conn;
    
    public mapBean() {
       conn = sql.getConnection();
    }
    
    public Collection getAllLabel()throws Exception{
        Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from mapLabel");
        while(rs.next()){
            mapVO map = new mapVO();
            map.setId(rs.getLong("id"));
            map.setX(rs.getString("x"));
            map.setY(rs.getString("y"));
            map.setName(rs.getString("name"));
            map.setInfo(rs.getString("info"));
            ret.add(map);
        }
        return ret;
    }
    
    public void addLabel(mapVO map)throws Exception{
            PreparedStatement pstmt = conn.prepareStatement("insert into mapLabel values(?,?,?,?,?)");
            pstmt.setLong(1,map.getId());
            pstmt.setString(2,map.getX());
            pstmt.setString(3,map.getY());
            pstmt.setString(4,map.getName());
            pstmt.setString(5,map.getInfo());
            pstmt.execute();
            
          
    }
}
