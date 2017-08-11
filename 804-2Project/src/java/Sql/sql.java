

package Sql;

import java.sql.*;
import java.sql.DriverManager;
import java.sql.SQLException;


public class sql {
   String Driver = "com.mysql.jdbc.Driver";
   String Url = "jdbc:mysql://localhost/Project";
   Connection conn;
   
    public sql() {
    }
    
    public Connection getConnection(){
        try{
        Class.forName(Driver);
        conn = DriverManager.getConnection(Url,"root","1278");
        }
        catch(ClassNotFoundException e){e.printStackTrace();}
        catch(SQLException e){e.printStackTrace();}
        return conn;
    }
    
}
