package com.pnucse.csenotice.Hugang;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.os.AsyncTask;
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


public class LectureActivity extends ActionBarActivity {


    PullToRefreshListView list;
    String prof_id;
    LectureAdapter adapter;
    CustomApplication app;
    String prof_page;

    Boolean InternetAvailable = false;
    Seocnd detectconnection;

    @Override
    protected void onStart() {
        super.onStart();
        setContentView(R.layout.activity_lecture2);


        final String getResult = getIntent().getStringExtra("prof_name");
        ActionBar abar = this.getSupportActionBar();
        abar.setTitle(getResult);
        abar.setDisplayOptions(ActionBar.DISPLAY_SHOW_TITLE);

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

        prof_id = getIntent().getStringExtra("prof_id");
        prof_page = getIntent().getStringExtra("prof_page");
        Log.d("prof_id",prof_id);
        list = (PullToRefreshListView)findViewById(R.id.lect_list);
        adapter = new LectureAdapter(this);

        list.setAdapter(adapter);
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                LectureItem curItem = (LectureItem) adapter.getItem(position);
                String[] curData= curItem.getData();
               // Toast.makeText(LectureActivity.this, "Selected : " + curData[0], Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LectureActivity.this,PostActivity.class);
                String string = curData[0];
                String lect_id = curData[2];
                String lect_url = curData[3];
                intent.putExtra("lect_name",string);
                intent.putExtra("lect_id",lect_id);
                intent.putExtra("lect_url",lect_url);
                startActivity(intent);
            }
        });



        list.setRefreshing();
        if (list.isRefreshing()) {
            Connect ct = new Connect();
            ct.execute(AppInfo.ParsingURL + "lecturelist",prof_id);
        }


        list.setOnRefreshListener(new PullToRefreshListView.OnRefreshListener() {

            @Override
            public void onRefresh() {
                // Your code to refresh the list contents goes here
                Connect ct = new Connect();
                ct.execute(AppInfo.ParsingURL + "lecturelist",prof_id);
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
            startActivity(intent);
        } else if (item.getItemId() == 2) {

            // WEB 화면 띄워주기
            //Intent intent = new Intent(getBaseContext(), Homepage.class);
            //startActivityForResult(intent, REQUEST_CODE_ABOUT);
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(prof_page));
            startActivity(intent);
        }

        return true;
    }

    /**
     * A placeholder fragment containing a simple view.
     */


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
            String a_prof_id;
            // 주소로부터 URL 객체 생성
            try {
                a_prof_id = params[1];
                String query = String.format("faculty_id=%s", URLEncoder.encode(a_prof_id, "UTF-8"));
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
            app = (CustomApplication)getApplication();
            //input01 .setText(result);
            Log.d("onPostExecute", "onPostExecute");
            try {
                Log.d("Hugang_Lecture_JSON","result" + result);
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                JSONArray dataarr = data.getJSONArray("list");
                Log.d("Hugang_Lecture_JSON","JSONObject2");
                Resources res = getResources();
                for (int i = 0; i< dataarr.length(); i++){
                    String name = null;
                    String id = null;
                    String count = null;
                    int order = 0;
                    data = dataarr.getJSONObject(i);
                    if (data.has("title") && data.has("_id")){
                        name = data.getString("title");
                        id = data.getString("_id");
                        if (data.has("postcount"))
                            count = data.getString("postcount");
                        if (data.has("order"))
                            order = Integer.parseInt(data.getString("order"));
                       // Log.d("Hugang_JSON", name);
                    }
                    else { continue;}
                    String lect_url = null;
                    lect_url = data.getString("postsparseurl");
                    adapter.additem(new LectureItem(res.getDrawable(R.drawable.thum_folder),name,count + "개의 탭이 있습니다",id,true,order,app.findMap_lect_item(id),lect_url));



                    //adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor),name,count + "개의 탭이 있습니다",res.getDrawable(R.drawable.green_light),id));
                }

                list.onRefreshComplete();


            } catch (Exception e) {
                Log.d("Error", e.getMessage());
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




}
