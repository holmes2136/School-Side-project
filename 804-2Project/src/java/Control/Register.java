

package Control;
import java.sql.*;
import java.util.*;
import Sql.sql;

public class Register {
    Connection conn;
    sql sql = new sql();
    
    public Register() {
        
        conn = sql.getConnection();
    }
    
    public void addMember(User user)throws Exception{
        PreparedStatement pstmt  = conn.prepareStatement("insert into member values(?,?,?,?,?,?,?,?,?,?,?)");
        pstmt.setInt(1,user.getId());
        pstmt.setString(2,user.getUsername());
        pstmt.setString(3,user.getPassword());
        pstmt.setString(4,user.getSex());
        pstmt.setString(5,user.getEmail());
        pstmt.setString(6,user.getIDcard());
        pstmt.setString(7,user.getPhoto());
        pstmt.setString(8,user.getStyle());
        pstmt.setString(9,user.getX());
        pstmt.setString(10,user.getY());
        pstmt.execute();
    }
    
    public Collection getTestMember()throws Exception{
        Collection ret = new ArrayList();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from member");
        while(rs.next()){
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setSex(rs.getString("sex"));
            user.setEmail(rs.getString("email"));
            user.setIDcard(rs.getString("IDcard"));
            user.setPhoto(rs.getString("photo"));
            user.setStyle(rs.getString("style"));
            user.setX(rs.getString("x"));
            user.setY(rs.getString("y"));
            ret.add(user);
            
        }
        return ret;
    }
    public User getUserInfo(String username)throws Exception{
        User user = new User();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("select * from member where username='"+username+"'");
        while(rs.next()){
            
            user.setId(rs.getInt("id"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setEmail(rs.getString("email"));
            user.setSex(rs.getString("sex"));
            user.setIDcard(rs.getString("IDcard"));
            user.setPhoto(rs.getString("photo"));
            user.setStyle(rs.getString("style"));
            user.setX(rs.getString("x"));
            user.setY(rs.getString("y"));
            
        }
        return user;
        
    }
    
    public void updatePhoto(User user)throws Exception{
        PreparedStatement pstmt = conn.prepareStatement("update member set photo=? where username=?");
        pstmt.setString(1,user.getPhoto());
        pstmt.setString(2,user.getUsername());
        pstmt.execute();
        
    }
    
    public void updateStyle(User user)throws Exception{
        PreparedStatement pstmt = conn.prepareStatement("update member set style=? where username=?");
        pstmt.setString(1,user.getStyle());
        pstmt.setString(2,user.getUsername());
        pstmt.execute();
        
    }
    
}
