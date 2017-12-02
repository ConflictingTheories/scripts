package com.kderbyma.altapower;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by kderbyma on 07/10/17.
 */

public class AESOData {

    // ASSET Class
    class AESOAsset {

        public String ASSET;
        public Integer DCR;
        public Integer MC;
        public Integer TNG;

        AESOAsset(JSONObject Asset){
            try {
                this.ASSET = Asset.getString("ASSET");
                this.DCR = Asset.getInt("DCR");
                this.MC = Asset.getInt("MC");
                this.TNG = Asset.getInt("TNG");
                Log.i("JSON_ASSET::" ,this.ASSET);
            }catch(JSONException e){
                e.printStackTrace();
            }
        }
    }

    public JSONObject Obj;
    public String type;
    public ArrayList<AESOAsset> AssetList;

    // Constructor
    AESOData(JSONObject JSON) {
        try {
            this.Obj = JSON;
            this.AssetList = new ArrayList<AESOAsset>();
            Iterator<?> keys = Obj.keys();
            while( keys.hasNext() ) {
                String key = (String) keys.next();
                Log.i("JSON_INFO::",key);
                if(this.Obj.get(key) instanceof JSONArray){
                    JSONArray groupArray = this.Obj.getJSONArray(key);
                    for(int i = 0; i < groupArray.length(); i++){
                        JSONObject asset = groupArray.getJSONObject(i);
                        Log.i("JSON_OUTPUT::",asset.toString());
                        AESOAsset assetObj = new AESOAsset(asset);
                        this.AssetList.add(assetObj);
                    }
                    Log.i("JSON_INFO::","ARRAY FOUND ----");
                }
            }
        }catch(JSONException e){
            e.printStackTrace();
        }
    }

}
