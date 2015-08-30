package com.pnucse.csenotice.Hugang;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;

import com.pnucse.csenotice.Hugang.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;

import eu.erikw.PullToRefreshListView;


public class PostActivity extends ActionBarActivity {

    PullToRefreshListView Postlist;
    PostAdapter adapter;
    String lecture_id;
    String lecture_page;
    Boolean InternetAvailable = false;
    Seocnd detectconnection;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post);

        if (getIntent().hasExtra("lect_name")){
            final String getResult = getIntent().getStringExtra("lect_name");
            ActionBar abar = this.getSupportActionBar();
            abar.setTitle(getResult);
            abar.setDisplayOptions(ActionBar.DISPLAY_SHOW_TITLE);
        }


    }

    @Override
    public void onStart(){
        super.onStart();

        AlertDialog.Builder alert = new AlertDialog.Builder(getBaseContext());
        detectconnection = new Seocnd(getBaseContext());
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
        lecture_id = getIntent().getStringExtra("lect_id");
        if (getIntent().hasExtra("lect_url"))
            lecture_page = getIntent().getStringExtra("lect_url");
        Postlist = (PullToRefreshListView)findViewById(R.id.post_list);
        adapter = new PostAdapter(this);

        Postlist.setAdapter(adapter);

        Postlist.setRefreshing();
        if (Postlist.isRefreshing()) {
            Connect ct = new Connect();
            ct.execute(AppInfo.ParsingURL + "postlist",lecture_id);
        }


        Postlist.setOnRefreshListener(new PullToRefreshListView.OnRefreshListener() {

            @Override
            public void onRefresh() {
                // Your code to refresh the list contents goes here
                Connect ct = new Connect();
                ct.execute(AppInfo.ParsingURL + "postlist",lecture_id);
                // for example:
                // If this is a webservice call, it might be asynchronous so
                // you would have to call listView.onRefreshComplete(); when
                // the webservice returns the data


                // Make sure you call listView.onRefreshComplete()
                // when the loading is done. This can be done from here or any
                // other place, like on a broadcast receive from your loading
                // service or the onPostExecute of your AsyncTask.


                // For the sake of this sample, the code will pause here to
                // force a delay when invoking the refresh
                /*
                listView1.postDelayed(new Runnable() {


                    @Override
                    public void run() {

                        Log.d("tag","ListView______________");
                    }
                }, 2000);*/
            }
        });


        Postlist.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PostItem curItem = (PostItem) adapter.getItem(position);
                String[] curData= curItem.getData();
                String post_url = curData[2];
                Log.d("Hugang_posturl",post_url);
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(post_url));
                startActivity(intent);
            }
        });
    }


    class Connect extends AsyncTask<String, Void, String> {
        @Override
        protected void onPreExecute() {
            //input01.setText("down...");
        }

        @Override
        protected String doInBackground(String... params) {
            URL url = null;
            String downloadedText = null;
            HttpURLConnection connection = null;
            String lect_id;
            // 주소로부터 URL 객체 생성
            try {
                lect_id = params[1];
                String query = String.format("lecture_id=%s", URLEncoder.encode(lect_id, "UTF-8"));
                url = new URL(params[0] + "?" + query);
            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "사용할 수 있는 인터넷 주소가 아닙니다." ;
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }

            // 서버와 연결 고리 생성
            try {

                connection = (HttpURLConnection)url.openConnection();
                if (null == connection) {
                    return "연결할 수 없습니다." ;
                }
            } catch (IOException e) {
                e.printStackTrace();
                return "IO 예외에 의해 연결할 수 없습니다." ;
            }

            // 연결 관련 설정
            try {
                connection.setRequestMethod( "GET" );
            } catch (ProtocolException e) {
                e.printStackTrace();
                return "잘못된 HTTP 요청 메소드입니다." ;
            }

            connection.setUseCaches( false );
            connection.setConnectTimeout(10000);


            // 서버에 텍스트 다운로드 요청
            try {
                switch (connection.getResponseCode()) {
                    case HttpURLConnection. HTTP_OK:        // 서버로부터 응답을 정상적으로 받은 경우
                        downloadedText = getTextFrom(connection.getInputStream());
                        break ;
                    default :    // 그 외의 경우들은 모두 오류로 간주
                        downloadedText = connection.getResponseCode() + " - " + connection.getResponseMessage();
                        break ;
                }

            } catch (IOException e) {
                e.printStackTrace();
            }

            connection.disconnect();
            return downloadedText;

        }

        /**
         * 다운로드 받은 텍스트를 화면에 보여 줍니다.
         * @param result 서버로부터 다운로드 받은 텍스트
         */

        @Override
        protected void onPostExecute(String result) {
            adapter.clear();
            //input01 .setText(result);
            Log.d("onPostExecute", "onPostExecute");
            try {
                Log.d("Hugang_JSON","result" + result);
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                lecture_page = data.getString("url");
                JSONArray dataarr = data.getJSONArray("list");
                //Log.d("Hugang_JSON","JSONObject2");
                Resources res = getResources();
                for (int i = 0; i< dataarr.length(); i++){
                    String name = null;
                    String id = null;
                    //String count = null;
                    String order = null;
                 //   Log.d("JSON", "hear");
                    data = dataarr.getJSONObject(i);
                   // Log.d("JSON", "hear2");
                    if (data.has("title") && data.has("_id")){
                        name = data.getString("title");
                        id = data.getString("_id");
                        //if (data.has("postcount"))
                           // count = data.getString("postcount");
                        if (data.has("order"))
                            order = data.getString("order");
                    }
                    else { continue;}
                    String posturl = data.getString("url");
                    adapter.additem(new PostItem(res.getDrawable(R.drawable.icon_notnew),name,id,true,order,posturl));
                   // Log.d("Hugang_url", posturl);
                    //adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor),name,count + "개의 탭이 있습니다",res.getDrawable(R.drawable.green_light),id));
                }

                Postlist.onRefreshComplete();


            } catch (Exception e) {
                Log.d("Hugang_JSONError", e.getMessage());
            }


        }

        /**
         * 서버와 연결된 스트림으로부터 텍스트를 읽어들입니다.
         * @param in 서버와 연결된 입력 스트림
         * @return 서버로부터 읽은 텍스트
         * */

            private String getTextFrom(InputStream in) {
                StringBuilder sb = new StringBuilder();
            BufferedReader br = null ;

            try {
                br = new BufferedReader( new InputStreamReader(in));

                // 스트림으로부터 라인 단위로 자료를 읽어 옵니다.
                while (true ) {
                    String line = br.readLine();
                    if (null == line) break;
                    sb.append(line + '\n');
                }
            }
            catch (IOException e) {
                e.printStackTrace();
            }

            try {
                br.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return sb.toString();
        }

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
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == 1) {
            // 설정 화면 띄워주기
            Intent intent = new Intent(getBaseContext(), SettingsActivity.class);
            startActivity(intent);
        } else if (item.getItemId() == 2) {

            // WEB 화면 띄워주기
            //Intent intent = new Intent(getBaseContext(), Homepage.class);
            //startActivityForResult(intent, REQUEST_CODE_ABOUT);
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(lecture_page));
            startActivity(intent);
        }

        return true;
    }


}
