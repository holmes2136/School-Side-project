/**
 * Yahoo! Web Services Example: Browser Based Authentication (BBAuth)
 *
 * @author Daniel Jones www.danieljones.org
 * Copyright 2007  
 *   
 * This example shows how to generate the URL used for Yahoo! Brower Based
 * Authentication. This example should be run before YahooBBAuthRequest
 * to obtain the auth token via the callback URL specified when you
 * obtained your application ID and secret.
 *  
 * If you do not have an Application ID and Secret, go to the Yahoo! 
 * BBAuth Registration page: https://developer.yahoo.com/wsregapp/index.php
 *
 */


import java.math.BigInteger;
import java.net.*;
import java.security.MessageDigest;

public class YahooBBAuth {	
	
	public static void main(String[] args) {
		try {
			/**
			 * Use the appId and secret provided when you registered your application
			 * https://developer.yahoo.com/wsregapp/index.php
			 */
			String appId = "lYqHK9rIkY0jLFlFi9eSD9goHT3hsa.5Fzgmrw--";
			String secret = "a9c3444ef7b41fbc3829a335a3cb731e";
			
			// Get the current time. Needed to sign the request.
            long time = System.currentTimeMillis() / 1000;
            
            /**
             * Generate the Yahoo! authentication URL that you will send users to to verify their Yahoo! identity 
             * 
             * More information can be found here: http://developer.yahoo.com/auth/user.html
             */
            String appData = "foobar";
            String authWS = "/WSLogin/V1/wslogin";
            String sig = authWS + "?appid=" + encode(appId) + "&appdata=" + encode(appData) + "&ts=" + time + secret;
            String signature = MD5(sig);
            String authURL = "https://api.login.yahoo.com" + authWS + "?appid=" + appId + "&appdata=" + appData +"&ts=" + time + "&sig=" + signature + "&send_userhash=1";
            /**
             * The end user will browse to this URL and allow access to your web
             * application. After authenticating, the user will be forwarded
             * to the callback URL specified when you obtained your application
             * ID and secret.
             */
            System.out.println(authURL);
            
		} catch (Exception e) {
                System.out.println("Web services request failed");
        }
	}
	
	/**
	 * This method returns the MD5 hash of a text string
	 */
	public static String MD5(String text)
	{
		String md5Text = "";
		try {
			MessageDigest digest = MessageDigest.getInstance("MD5");
			md5Text = new BigInteger(1, digest.digest((text).getBytes())).toString(16);
		} catch (Exception e) {
			System.out.println("Error in call to MD5");
		}
		
        if (md5Text.length() == 31) {
            md5Text = "0" + md5Text;
        }
		return md5Text;
	}
	
	/**
	 * URL encode a text string
	 */
	public static String encode(String text)
	{
		String etext = "";
		try {
			etext = URLEncoder.encode(text, "UTF-8");
		} catch (Exception e) {
			System.out.println("Error in call to encode");
		}
		return etext;
	}
}
