

package Friends;
import java.util.*;
import java.sql.*;
import Sql.sql;

public class FriendsControl {
    Connection conn;
    sql sql = new sql();
 
    public FriendsControl() {
        
        conn = sql.getConnection();
    }
    
    public Collection getAllFriends()throws Exception{
            Collection ret = new ArrayList();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("select * from friends");
            while(rs.next()){
                FriendsVO friends = new FriendsVO();
                friends.setId(rs.getInt("id"));
                friends.setName(rs.getString("name"));
                friends.setAddress(rs.getString("address"));
                ret.add(friends);
            }
            
            return ret;
    }
    
    public void addFriends(FriendsVO friends)throws Exception{
           PreparedStatement pstmt = conn.prepareStatement("insert into friends value(?,?,?)");
           pstmt.setInt(1,friends.getId());
           pstmt.setString(2,friends.getName());
           pstmt.setString(3,friends.getAddress());
           pstmt.execute();
            
    
    }
    
    public void deleteFriends(String[] keys)throws Exception{
           PreparedStatement pstmt = conn.prepareStatement("delete from friends where id = ?");
           for(int i=0;i<keys.length;i++){
               pstmt.setInt(1,Integer.parseInt(keys[i]));
               pstmt.execute();
               
           }
         
    }
}
