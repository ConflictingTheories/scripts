package com.kderbyma.altapower;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.kderbyma.altapower.fragments.ContentFragmentActivity;
import com.kderbyma.altapower.fragments.MapActivity;
import com.kderbyma.altapower.fragments.SelectionFragment;

public class MainWithFragments extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_fragments);

        // Toolbar
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Menu Drawer
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        // Navigation View
        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

//        // Include Fragment
        ContentFragmentActivity content = new ContentFragmentActivity();
        this.loadFragment(content, "mainContent");
    }

    // Click Button to Continue
    public void continueToSelection(View view) {
        // Prepare Next Activity
        Intent intent = new Intent(this, SelectionActivity.class);
        RadioGroup categorySelection = (RadioGroup) findViewById(R.id.categorySelection);
        RadioButton selectedButton = (RadioButton) findViewById(categorySelection.getCheckedRadioButtonId());
        if(selectedButton == null){
            Snackbar.make(view, "PLEASE MAKE A SELECTION FIRST", Snackbar.LENGTH_LONG)
                    .setAction("Action", null).show();
        } else {
            CharSequence selectedText = selectedButton.getText();
            Log.i("OUTPUT::",selectedText.toString());
            intent.putExtra("selection", selectedText);
            Log.i("GENERAL::", "SELECTED::::" + selectedText);
            // Go to Next Activity
            startActivity(intent);
        }
    }

    // Load Fragment
    public void loadFragment(android.app.Fragment frag, String tag)
    {
        FragmentManager fm = getFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();

        android.app.Fragment fragment = getFragmentManager().findFragmentById(R.id.fragment);
        if(fragment == null)
        {
            ft.add(R.id.fragment, frag, tag);
        } else
        {
            ft.replace(R.id.fragment, frag, tag);
        }
        ft.addToBackStack(null);

        ft.commit();
        // Create a new fragment and specify the planet to show based on position
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_comp) {
            // Handle the camera action
        } else if (id == R.id.nav_live) {
            Intent intent = new Intent(this, SelectionActivity.class);
            intent.putExtra("selection", "Gas");
            Log.i("GENERAL::", "SELECTED::::" + "Gas");
            // Go to Next Activity
            startActivity(intent);

        } else if (id == R.id.nav_map) {
            Intent intent = new Intent(this, MapActivity.class);
            Log.i("GENERAL::", "SELECTED::::" + "Gas");
            // Go to Next Activity
            startActivity(intent);

        } else if (id == R.id.nav_hist) {
//        // Include Fragment
            ContentFragmentActivity content = new ContentFragmentActivity();
            this.loadFragment(content, "mainContent");

        } else if (id == R.id.nav_about) {
            //        // Include Fragment
            SelectionFragment selecto = new SelectionFragment();
            this.loadFragment(selecto, "mapContent");

        } else if (id == R.id.nav_contact) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}
