package com.pnucse.csenotice.Hugang;


import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import com.pnucse.csenotice.Hugang.R;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import it.neokree.materialtabs.MaterialTab;
import it.neokree.materialtabs.MaterialTabHost;
import it.neokree.materialtabs.MaterialTabListener;

//import it.neokree.materialtabs.MaterialTab;

public class MainActivity extends ActionBarActivity {

    ViewPager pager;
    ViewPagerAdapter pagerAdapter;
    MaterialTabHost tabhost;

    //CustomApplication custom = new CustomApplication();


    /**
     * About 액티비티를 띄우기 위한 요청코드
     */
    public static final int REQUEST_CODE_ABOUT = 1002;

    /**
     * 설정 액티비티를 띄우기 위한 요청코드
     */
    public static final int REQUEST_CODE_SETTINGS = 1003;

    Boolean InternetAvailable = false;
    Seocnd detectconnection;



    @Override
    protected void onStart() {

        super.onStart();
        setContentView(R.layout.activity_main);




        AlertDialog.Builder alert = new AlertDialog.Builder(MainActivity.this);
        detectconnection = new Seocnd(MainActivity.this);
        InternetAvailable = detectconnection.InternetConnecting();
        alert.setPositiveButton("확인", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                moveTaskToBack(true);
                finish();
                android.os.Process.killProcess(android.os.Process.myPid());
                dialog.dismiss();     //닫기
            }
        });

        alert.setMessage("인터넷 연결 해야 되용");


        if (!InternetAvailable) {
            Log.d("Hugang_setOnRefresh", "No Internet");
            alert.show();
        }


            tabhost = (MaterialTabHost) this.findViewById(R.id.tabhost);
            pager = (ViewPager) this.findViewById(R.id.pager);


            //ActionBar Title Set
            ActionBar abar = this.getSupportActionBar();
            abar.setTitle("PNU CSE");
            //register push_id
            CustomApplication custom = (CustomApplication)getApplication();

            registerDevice();




            // 뷰페이저 어댑터를 만듭니다.
            pagerAdapter = new ViewPagerAdapter(getSupportFragmentManager());
            pager.setAdapter(pagerAdapter);
            pager.setOnPageChangeListener(new ViewPager.SimpleOnPageChangeListener() {
                @Override
                public void onPageSelected(int position) {
                    tabhost.setSelectedNavigationItem(position);
                }
            });

            // 탭의 글자색을 지정합니다.
            tabhost.setTextColor(Color.rgb(67,67,67));

            // 탭의 배경색을 지정합니다.
            tabhost.setPrimaryColor(Color.rgb(240,240,240));

            // 탭을 추가합니다.
            for (int i = 0; i < pagerAdapter.getCount(); i++) {
                MaterialTab tab = tabhost.newTab();
                tab.setText(pagerAdapter.getPageTitle(i));
                tab.setTabListener(new ProductTabListener());

                tabhost.addTab(tab);
            }

            // 처음 선택된 탭을 지정합니다.
            tabhost.setSelectedNavigationItem(0);
        }


        //if (!isOnline()) super.finish();









    boolean BackPressed;
    long S_Time = System.currentTimeMillis(), E_Time;
    public void onBackPressed() {
        E_Time = System.currentTimeMillis();

        if(E_Time - S_Time > 2000) {
            BackPressed = false;
        }

        if(BackPressed == false) {
            BackPressed= true;
            S_Time = System.currentTimeMillis();
            Toast.makeText(this, "'뒤로'버튼을 한번 더 누르면 종료됩니다.",
                    Toast.LENGTH_SHORT).show();


        }
        else {
            finish();
            System.exit(0);
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }


    /**
     * 뷰페이저 어댑터를 정의합니다.
     */
    private class ViewPagerAdapter extends FragmentStatePagerAdapter {

        public ViewPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        public Fragment getItem(int index) {
            Fragment frag = null;

            if (index == 0) {
                frag = new Fragment01();
            } else if (index == 1) {
                frag = new Fragment02();
            }

            return frag;
        }

        @Override
        public int getCount() {
            return 2;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            switch(position) {
                case 0: return "교수님들";
                case 1: return "내 강의";

                default: return null;
            }
        }

    }

    /**
     * 탭을 선택했을 때 처리할 리스너 정의
     */
    private class ProductTabListener implements MaterialTabListener {

        public ProductTabListener() {

        }

        @Override
        public void onTabSelected(MaterialTab tab) {
            pager.setCurrentItem(tab.getPosition());
        }

        @Override
        public void onTabReselected(MaterialTab tab) {

        }

        @Override
        public void onTabUnselected(MaterialTab tab) {

        }

    }

    class RegisterThread extends Thread {
        public void run() {

            try {
                GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(getApplicationContext());
                String regId = gcm.register(GCMInfo.PROJECT_ID);

                Log.d("Hugang_push","등록 ID : " + regId);

                // 등록 ID 리스트에 추가 (현재는 1개만)
                CustomApplication custom = (CustomApplication)getApplication();
                custom.setPushid(regId);
                custom.setPushPost(true);

                //Push 클릭해서 들어옴
                if( getIntent().hasExtra("MODE")) {
                    String getResult = getIntent().getStringExtra("MODE");
                    getIntent().removeExtra("MODE");
                    if (getResult.contains("NOTICE")) {

                        Log.d("Hugang_registerdevice", "1");
                        Intent intent = new Intent(MainActivity.this, NoticeActivity.class);
                        startActivity(intent);
                    } else if (getResult.contains("LECTURE")) {
                        Log.d("Hugang_registerdevice", "2");
                        getIntent().putExtra("Notice", false);
                        Intent intent = new Intent(MainActivity.this, PostActivity.class);
                        intent.putExtra("lect_id", getIntent().getStringExtra("lect_id"));
                        intent.putExtra("lect_url", "www.naver.com");
                        startActivity(intent);
                    } else if (getResult.contains("HISTORY")) {
                        Log.d("Hugang_registerdevice", "4");
                        getIntent().putExtra("isHistory", false);
                        Intent intent = new Intent(MainActivity.this, HistoryActivity.class);
                        startActivity(intent);

                    } else {
                        Log.d("Hugang_registerdevice", "3");
                        Toast.makeText(MainActivity.this, "해당 강의가 없습니다",
                                Toast.LENGTH_SHORT).show();
                    }
                }



            } catch(Exception ex) {
                ex.printStackTrace();
            }

        }
    }



    /**
     * 단말 등록
     */
    private void registerDevice() {

        RegisterThread registerObj = new RegisterThread();
        registerObj.start();

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // 코드에서 직접 옵션 메뉴 추가하기
        super.onCreateOptionsMenu(menu);
        addOptionMenuItems(menu);

        return true;
    }

    /**
     * 옵션 메뉴의 아이템들 추가
     *
     * @param menu
     */
    private void addOptionMenuItems(Menu menu) {
        int base = Menu.FIRST;

        MenuItem item01 = menu.add(base, base, Menu.NONE,"Settings");
        MenuItem item02 = menu.add(base, base+1, Menu.NONE,"Link");

        //item01.setIcon(R.drawable.settings_icon);
       // item02.setIcon(R.drawable.about_icon);
    }

    /**
     * 옵션 메뉴가 선택되었을 때 호출됨
     */
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == 1) {
            // 설정 화면 띄워주기
            Intent intent = new Intent(getBaseContext(), SettingsActivity.class);
            startActivityForResult(intent, REQUEST_CODE_SETTINGS);
        } else if (item.getItemId() == 2) {

            // WEB 화면 띄워주기
            //Intent intent = new Intent(getBaseContext(), Homepage.class);
            //startActivityForResult(intent, REQUEST_CODE_ABOUT);
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://uwcms.pusan.ac.kr/user/indexSub.action?codyMenuSeq=21694&siteId=cse&linkUrl="));
            startActivity(intent);
        }

        return true;
    }






}