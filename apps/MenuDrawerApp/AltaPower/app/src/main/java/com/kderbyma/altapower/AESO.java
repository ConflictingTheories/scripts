package com.kderbyma.altapower;

import org.json.JSONException;
import org.json.JSONObject;


/**
 * Created by kderbyma on 23/09/17.
 */

public class AESO {

    // ==== MAIN API ENDPOINT ====
//    private static final String BASEURL = "http://10.0.2.2:3000/";
    private static final String BASEURL = "http://162.246.156.83:3000/";

    // ==== API ENDPOINTS ====
    // -- /live - Live Data
    private static final String LIVE_URL = BASEURL + "live/";
    // -- /history -- Historical Data
    private static final String HIST_URL = BASEURL + "history/";
    private static final String HIST_AT = HIST_URL + "at/";
    private static final String HIST_FROM = HIST_URL + "from/";
    private static final String HIST_LAST = HIST_URL + "last/";
    // -- /location -- Location Data on Sites
    private static final String LOC_URL = BASEURL + "location/";


    // ==== API CALL METHODS ====
    //
    // -- Live Data
    public HttpRequest AESOLiveData = new HttpRequest("GET",LIVE_URL);
    // -- Historical Data
    public HttpRequest AESOHistData = new HttpRequest("GET",HIST_URL);
    public HttpRequest AESOHistAtData = new HttpRequest("GET",HIST_AT);
    public HttpRequest AESOHistFromData = new HttpRequest("GET",HIST_FROM);
    public HttpRequest AESOHistLastData = new HttpRequest("GET",HIST_LAST);
    // -- Location Data
    public HttpRequest AESOLocData = new HttpRequest("GET",LOC_URL);

    // -- Parse Data
    public static AESOData parseData(JSONObject JSON) throws JSONException {
        return new AESOData(JSON);
    }

}
