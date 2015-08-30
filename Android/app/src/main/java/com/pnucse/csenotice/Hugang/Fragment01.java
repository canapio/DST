package com.pnucse.csenotice.Hugang;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.pnucse.csenotice.Hugang.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

import eu.erikw.PullToRefreshListView;
import eu.erikw.PullToRefreshListView.OnRefreshListener;
//import eu.erikw.PullToRefresh.sample.PullToRefreshListViewSampleActivity.PullToRefreshListViewSampleAdapter.ViewHolder;

public class Fragment01 extends Fragment {
	//ListView listView1;
    private PullToRefreshListView listView1;
    TextView input01;
    IconTextListAdapter adapter;


    Handler handler = new Handler();




	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState ) {
        View view = inflater.inflate(R.layout.frag01,null);





        //enable
        listView1 = (PullToRefreshListView)view.findViewById(R.id.text01);
        adapter = new IconTextListAdapter(getActivity());



        listView1.setAdapter(adapter);

        listView1.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                IconTextItem curItem = (IconTextItem) adapter.getItem(position);
                String[] curData= curItem.getData();
                //String ord = Integer.toString(curItem.getOrder());
                //Toast.makeText(getActivity(),"Selected : " + ord, Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getActivity(),LectureActivity.class);
                String string = curData[0];
                String prof_id = curData[2];
                String prof_url = curData[3];
                Drawable adraw = curItem.getIcon2();
                intent.putExtra("prof_name",string);
                intent.putExtra("prof_page",prof_url);
                intent.putExtra("prof_id",prof_id);
                startActivity(intent);


            }
        });


        listView1.setRefreshing();
        if (listView1.isRefreshing()) {
            try {
                Log.d("Hugang_isRefreshing","isRefreshing");
                Connect ct = new Connect();
                ct.execute(AppInfo.ParsingURL + "facultylist");

            }
            catch ( Exception e) {
                e.printStackTrace();
            }
        }




        listView1.setOnRefreshListener(new OnRefreshListener() {

            @Override
            public void onRefresh() {
                // Your code to refresh the list contents goes here

                    Connect ct = new Connect();
                    ct.execute(AppInfo.ParsingURL + "facultylist");

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
        return view;



	}


    class Connect extends AsyncTask<String, Void, String>{
        @Override
        protected void onPreExecute() {

            //input01.setText("down...");
        }

        @Override
        protected String doInBackground(String... params) {
            URL url = null;
            String downloadedText = null;
            HttpURLConnection connection = null;

            // 주소로부터 URL 객체 생성
            try {
                url = new URL(params[0]);
            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "에러" ;
            }

            // 서버와 연결 고리 생성
            try {
                connection = (HttpURLConnection)url.openConnection();
                if (null == connection) {
                    return "에러" ;
                }
            } catch (IOException e) {
                e.printStackTrace();
                return "에러" ;
            }

            // 연결 관련 설정
            try {
                connection.setRequestMethod( "GET" );
            } catch (ProtocolException e) {
                e.printStackTrace();
                return "에러" ;
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

            if (result.equals("에러")){
                AlertDialog.Builder alert = new AlertDialog.Builder(getActivity());
                alert.setPositiveButton("확인", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        getActivity().moveTaskToBack(true);
                        getActivity().finish();
                        android.os.Process.killProcess(android.os.Process.myPid());
                        dialog.dismiss();     //닫기
                    }
                });
                alert.setMessage("네트워크 에러어엉");
            }
            //input01 .setText(result);
            adapter.clear();
            //Log.d("onPostExecute","onPostExecute");
            try {
                //Log.d("JSON","JSONObject");
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                JSONArray dataarr = data.getJSONArray("list");

                Resources res = getResources();
                for (int i = 0; i< dataarr.length(); i++){

                    String name = null;
                    String id = null;
                    String count = null;
                    int order = 0;
                    data = dataarr.getJSONObject(i);
                    if (data.has("name") && data.has("_id")){
                        name = data.getString("name");
                        id = data.getString("_id");
                        if (data.has("lecturecount"))
                            count = data.getString("lecturecount");
                        if (data.has("order"))
                            order = Integer.parseInt(data.getString("order"));
                    }
                    else { continue;}
                    String enable = null;
                    enable = data.getString("status");
                    String pageurl = null;
                    pageurl = data.getString("lecturesparseurl");

                    if(name.contains("컴퓨터공학"))
                    {
                        adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor), name, count + "개의 탭이 있습니다", res.getDrawable(R.drawable.icon_status_e), id, order, true, pageurl));
                    }
                    else {
                        if (enable.equals("e"))
                            adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor), name + " 교수님", count + "개의 탭이 있습니다", res.getDrawable(R.drawable.icon_status_e), id, order, true, pageurl));
                        else if (enable.equals("w"))
                            adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor), name + " 교수님", count + "개의 탭이 있습니다", res.getDrawable(R.drawable.icon_status_w), id, order - 50, true, pageurl));
                        else
                            adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor), name + " 교수님", count + "개의 탭이 있습니다", res.getDrawable(R.drawable.icon_status_d), id, order - 100, false, pageurl));
                        //Log.d("JSON",name);
                    }

                    listView1.onRefreshComplete();

                }


            } catch (Exception e) {
                Log.d("TodayNo_JSONError", e.getMessage());
            }


            /*
            try {
                JSONArray ja = new JSONArray(result);
                Log.d("length : ","oo"+Integer.toString(ja.length()));
                for(int i = 0; i<ja.length();i++){
                    JSONObject obj = ja.getJSONObject(i);
                    Log.d("obj : ", obj.getString("errorcode"));
                    if (obj.getString("errorcode") != "0"){
                        Log.d("dd","dddd");
                        break;
                    }
                    if (obj.getString("errormsg") != "success")
                        break;

                    if (obj.getString("name") == null)
                        continue;
                    temp = obj.getString("name");

                    adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor),temp,"개의 탭이 있습니다"));

                }
            } catch(JSONException ex){

            }*/


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



	
