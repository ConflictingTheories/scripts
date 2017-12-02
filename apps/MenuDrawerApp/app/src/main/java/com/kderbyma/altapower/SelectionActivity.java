package com.kderbyma.altapower;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.kderbyma.altapower.AESO.AESOCore;
import com.kderbyma.altapower.AESO.AESOData;
import com.kderbyma.altapower.utils.HttpRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class SelectionActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_selection);

        // Get the Intent that started this activity and extract the string
        Intent intent = getIntent();
        String selection = intent.getStringExtra("selection");

        // Capture the layout's TextView and set the string as its text
//        TextView textView = (TextView) findViewById(R.id.powerText);
        // Find Line Chart
        BarChart chart = (BarChart) findViewById(R.id.chart);


        // AESO Object
        AESOCore AESOObj = new AESOCore();
        // New Live Data Object
        HttpRequest liveData = AESOObj.AESOLiveData;
        //String to place our result in
        String live;

        // Fetch Data
        try {
            live = liveData.execute(selection.toLowerCase()).get();
        } catch (InterruptedException e) {
            e.printStackTrace();
            live="InteruptedError;";
        } catch (ExecutionException e) {
            e.printStackTrace();
            live="Execution Error;";
        }

        // Parse Data and Chart
        try {
            // Data Object
            JSONObject liveJsonData = new JSONObject(live);


            // Message Information
            String status = "";
            String msg = "";
            JSONObject jdata;

            List<BarEntry> entries = new ArrayList<>();
            List<String> labels = new ArrayList<>();

            //Clear Text
//            textView.setText("");

            // Iterate Through Object
            ArrayList Keys = new ArrayList<String>();
            Iterator<?> KeyIt = liveJsonData.keys();
            while( KeyIt.hasNext() ) {
                String key = (String)KeyIt.next();
//                textView.append("::" + key + "\n");
                switch(key) {
                    case "status":
                        status = liveJsonData.getString(key);
                        Log.i("REQUEST_STATUS::",status);
                        break;
                    case "msg":
                        msg = liveJsonData.getString(key);
                        Log.i("REQUEST_MSG::",msg);
                        break;
                    case "data":
                        Log.i("REQUEST_DATA::","");
                        if(liveJsonData.get(key) instanceof JSONObject){
                            // Extract Object
                            jdata = liveJsonData.getJSONObject(key);
                            // Parse Data
                            AESOData dataObj = new AESOData(jdata);
                            // Add to Chart
//                            labels = new String[dataObj.AssetList.size()];
                            for(int i = 0; i < dataObj.AssetList.size(); i++){
                                // Asset Listing
                                AESOData.AESOAsset myAsset = dataObj.AssetList.get(i);
                                // Barchart Entry Data
                                BarEntry myEntry = new BarEntry(i,(float)myAsset.TNG);
                                entries.add(myEntry);
                                String[] pieces = myAsset.ASSET.split(" ");
                                String Code = pieces[pieces.length-1];
                                labels.add(Code);
                                // Log Entry
                                Log.i("CHART_OUT::",myAsset.TNG.toString());
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            // Build Data Set
            List<Integer> colors = new ArrayList<Integer>();
            colors.add(getResources().getColor(R.color.red));
            colors.add(getResources().getColor(R.color.orange));
            colors.add(getResources().getColor(R.color.yellow));
            colors.add(getResources().getColor(R.color.green));
            colors.add(getResources().getColor(R.color.blue));

            // Data Set
            BarDataSet set = new BarDataSet(entries, "AESO Data :: " + selection);
            set.setColors(colors);

            // Data Object
            BarData data = new BarData(set);
            data.setValueTextColor(getResources().getColor(R.color.white));

            // Apply Data to Chart
            chart.setData(data);
            chart.getAxisLeft().setTextColor(getResources().getColor(R.color.white));
            chart.getAxisRight().setTextColor(getResources().getColor((R.color.white)));
            // Desciption
            Description chartDesc = new Description();
            chartDesc.setTextColor(getResources().getColor(R.color.white));
            chartDesc.setText("Total Net Generation for " + selection + " plants in Alberta.");
            chart.setDescription(chartDesc);
            // Chart Styling
            chart.setBackgroundColor(getResources().getColor(R.color.black));
            chart.setGridBackgroundColor(getResources().getColor(R.color.white));
            chart.setBorderColor(getResources().getColor(R.color.white));
            // Chart Settings
            chart.setDrawValueAboveBar(true);
            chart.setTouchEnabled(true);
            chart.setVisibleXRangeMaximum(6f);
            //Y-Axis Styling
            // X-Axis Styling
            chart.getXAxis().setTextColor(getResources().getColor(R.color.white));
            chart.getXAxis().setValueFormatter(new IndexAxisValueFormatter(labels));
            chart.getXAxis().setGranularity(1f);
            chart.getXAxis().setGranularityEnabled(true);
            chart.getXAxis().setPosition(XAxis.XAxisPosition.BOTTOM);
            chart.getLegend().setTextColor(getResources().getColor(R.color.white));
            chart.setFitBars(true); // make the x-axis fit exactly all bars
            chart.invalidate(); // refresh

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
