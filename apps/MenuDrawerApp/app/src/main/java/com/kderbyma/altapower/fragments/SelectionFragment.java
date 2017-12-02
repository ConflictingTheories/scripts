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

public class SelectionFragment extends android.app.Fragment {

    private final String TAG = "com.example.app.FragmentTwo";

    private Activity mActivity;

    @Override
    public void onAttach(Activity act)
    {
        super.onAttach(act);

        this.mActivity = act;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
    {
        View view = inflater.inflate(R.layout.activity_main_fragments, container, false);

        //do whatever you want here - like set text to display in your fragment

        return view;
    }
}
