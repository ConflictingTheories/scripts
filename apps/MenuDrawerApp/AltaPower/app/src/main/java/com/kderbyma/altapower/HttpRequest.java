package com.kderbyma.altapower;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by kderbyma on 07/10/17.
 */

public class HttpRequest extends AsyncTask<String, Void, String> {

    // Performs GET Request (Called by execute())
    public String REQUEST_METHOD = "GET";
    public int READ_TIMEOUT = 15000;
    public int CONNECTION_TIMEOUT = 15000;
    public String BASE_URL = "";

    // if no method -- do nothing
    HttpRequest(){}

    // setup the method
    HttpRequest(String METHOD){
        this.REQUEST_METHOD = METHOD;
    }
    // setup the method
    HttpRequest(String METHOD, String BASE){
        this.REQUEST_METHOD = METHOD;
        this.BASE_URL = BASE;
    }

    // Run Command
    @Override
    protected String doInBackground(String... params) {

        String stringUrl = this.BASE_URL + params[0];
        String result;
        String inputLine;

        try {
            //Create a URL object holding our url
            URL myUrl = new URL(stringUrl);
            //Create a connection
            HttpURLConnection connection =(HttpURLConnection) myUrl.openConnection();
            //Set methods and timeouts
            connection.setRequestMethod(REQUEST_METHOD);
            connection.setReadTimeout(READ_TIMEOUT);
            connection.setConnectTimeout(CONNECTION_TIMEOUT);
            // Make Connection
            connection.connect();

            //Create a new InputStreamReader
            InputStreamReader streamReader = new InputStreamReader(connection.getInputStream());
            //Create a new buffered reader and String Builder
            BufferedReader reader = new BufferedReader(streamReader);
            StringBuilder stringBuilder = new StringBuilder();
            //Check if the line we are reading is not null
            while((inputLine = reader.readLine()) != null){
                stringBuilder.append(inputLine);
            }
            //Close our InputStream and Buffered reader
            reader.close();
            streamReader.close();
            //Set our result equal to our stringBuilder
            result = stringBuilder.toString();
        }
        catch(IOException e){
            e.printStackTrace();
            result = null;
        }
        return result;
    }
    @Override
    protected void onPostExecute(String result){
        super.onPostExecute(result);
    }
}
