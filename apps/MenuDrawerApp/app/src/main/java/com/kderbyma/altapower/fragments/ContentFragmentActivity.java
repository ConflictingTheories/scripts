package com.kderbyma.altapower.fragments;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import com.kderbyma.altapower.R;

public class ContentFragmentActivity extends android.app.Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.app_bar_main, container, false);

//        //do whatever you want here - like set text to display in your fragment
////        Floating Button
//        FloatingActionButton fab = (FloatingActionButton) container.findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
////                continueToSelection(view);
//            }
//        });
//
//        //Styling
//        TextView EntryText = (TextView) container.findViewById(R.id.textMain);
//        EntryText.setTextColor(getResources().getColor(R.color.black));
//
//        // Radio Select Buttons
//        RadioGroup categorySelection = (RadioGroup) container.findViewById(R.id.categorySelection);

        return view;
    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
////        super.onCreate(savedInstanceState);
////        setContentView(R.layout.activity_main);
////
////        // Floating Button
////        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
////        fab.setOnClickListener(new View.OnClickListener() {
////            @Override
////            public void onClick(View view) {
////                continueToSelection(view);
////            }
////        });
////
////        //Styling
////        TextView EntryText = (TextView) findViewById(R.id.textMain);
////        EntryText.setTextColor(getResources().getColor(R.color.black));
////
////        // Radio Select Buttons
////        RadioGroup categorySelection = (RadioGroup) findViewById(R.id.categorySelection);
//    }

    // Click Button to Continue
//    public void continueToSelection(View view) {
//        // Prepare Next Activity
//        Intent intent = new Intent(this, SelectionActivity.class);
//        RadioGroup categorySelection = (RadioGroup) findViewById(R.id.categorySelection);
//        RadioButton selectedButton = (RadioButton) findViewById(categorySelection.getCheckedRadioButtonId());
//        if(selectedButton == null){
//            Snackbar.make(view, "PLEASE MAKE A SELECTION FIRST", Snackbar.LENGTH_LONG)
//                    .setAction("Action", null).show();
//        } else {
//            CharSequence selectedText = selectedButton.getText();
//            Log.i("OUTPUT::",selectedText.toString());
//            intent.putExtra("selection", selectedText);
//            Log.i("GENERAL::", "SELECTED::::" + selectedText);
//            // Go to Next Activity
//            startActivity(intent);
//        }
//    }
}
