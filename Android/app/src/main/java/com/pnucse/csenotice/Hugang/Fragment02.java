package com.pnucse.csenotice.Hugang;

import android.content.Intent;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Toast;

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

public class Fragment02 extends Fragment {


    PullToRefreshListView list;
    LectureAdapter adapter;
    CustomApplication app;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.frag02, null);


        list = (PullToRefreshListView) view.findViewById(R.id.favorite);
        adapter = new LectureAdapter(getActivity());

        app = (CustomApplication)getActivity().getApplication();
        app.favo_tab = this;
        list.setAdapter(adapter);
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                LectureItem curItem = (LectureItem) adapter.getItem(position);
                String[] curData = curItem.getData();
                Toast.makeText(getActivity(), "Selected : " + curData[0], Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getActivity(), PostActivity.class);
                String string = curData[0];
                String lect_id = curData[2];

                intent.putExtra("lect_name", string);
                intent.putExtra("lect_id", lect_id);

                String lect_url = curData[3];
                if (lect_url.equals("favo"))
                {

                }
                else
                    intent.putExtra("lect_url",lect_url);
                startActivity(intent);
            }
        });


        list.setRefreshing();
        //final String pushid = app.getPushid();



        return view;
    }

    public void setpushid(String apush_id){
        //Log.d("aaaasetpushaaaa",pushid);
        final String pushid = apush_id;
        Log.d("TodayNo_Pushid", pushid + "list Refreshing--------------------------");

        if (list.isRefreshing()) {
            Log.d("First", "list Refreshing--------------------------");
            Connect ct = new Connect();
            ct.execute(AppInfo.ParsingURL + "favolecturelist", pushid);
        }


        list.setOnRefreshListener(new PullToRefreshListView.OnRefreshListener() {

            @Override
            public void onRefresh() {
                // Your code to refresh the list contents goes here
                Connect ct = new Connect();
                ct.execute(AppInfo.ParsingURL + "favolecturelist", pushid);
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
            String push_id;

            // 주소로부터 URL 객체 생성
            try {
                push_id = params[1];
                String query1 = String.format("pushid=%s", URLEncoder.encode(push_id, "UTF-8"));
                String query2 = String.format("platform=%s", URLEncoder.encode("android", "UTF-8"));
                url = new URL(params[0] + "?" + query1 + "&" + query2);
                Log.d("url", url.toString() + " ------------------____________________---");
            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "사용할 수 있는 인터넷 주소가 아닙니다.";
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }

            // 서버와 연결 고리 생성
            try {

                connection = (HttpURLConnection) url.openConnection();
                if (null == connection) {
                    return "연결할 수 없습니다.";
                }
            } catch (IOException e) {
                e.printStackTrace();
                return "IO 예외에 의해 연결할 수 없습니다.";
            }

            // 연결 관련 설정
            try {
                connection.setRequestMethod("GET");
            } catch (ProtocolException e) {
                e.printStackTrace();
                return "잘못된 HTTP 요청 메소드입니다.";
            }

            connection.setUseCaches(false);
            connection.setConnectTimeout(10000);


            // 서버에 텍스트 다운로드 요청
            try {
                switch (connection.getResponseCode()) {
                    case HttpURLConnection.HTTP_OK:        // 서버로부터 응답을 정상적으로 받은 경우
                        downloadedText = getTextFrom(connection.getInputStream());
                        break;
                    default:    // 그 외의 경우들은 모두 오류로 간주
                        downloadedText = connection.getResponseCode() + " - " + connection.getResponseMessage();
                        break;
                }

            } catch (IOException e) {
                e.printStackTrace();
            }

            connection.disconnect();
            return downloadedText;

        }

        /**
         * 다운로드 받은 텍스트를 화면에 보여 줍니다.
         *
         * @param result 서버로부터 다운로드 받은 텍스트
         */

        @Override
        protected void onPostExecute(String result) {
            adapter.clear();
            app = (CustomApplication)getActivity().getApplication();
            //input01 .setText(result);
            //Log.d("onPostExecute", "onPostExecute");
            try {
                Log.d("TodayNo_favo", "result : " + result);
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                JSONArray dataarr = data.getJSONArray("list");
                //Log.d("JSON", "JSONObject2");
                Resources res = getResources();
                for (int i = 0; i < dataarr.length(); i++) {
                    String name = null;
                    String id = null;
                    String count = null;
                    int order = 0;
                    data = dataarr.getJSONObject(i);
                    if (data.has("title") && data.has("_id")) {
                        name = data.getString("title");
                        id = data.getString("_id");
                        if (data.has("postcount"))
                            count = data.getString("postcount");
                        if (data.has("order"))
                            order = Integer.parseInt(data.getString("order"));
                    } else {
                        continue;
                    }
                    String url = null;
                    //url = data.getString("postsparseurl");
                    app.setMap_lect_item(id,new LectureItem(res.getDrawable(R.drawable.thum_folder), name, count + "개의 탭이 있습니다", id, true, order, true,"favo"));
                    adapter.additem(new LectureItem(res.getDrawable(R.drawable.thum_folder), name, count + "개의 탭이 있습니다", id, true, order, true,"favo"));
                    //Log.d("JSON", name);
                    //adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor),name,count + "개의 탭이 있습니다",res.getDrawable(R.drawable.green_light),id));
                }

                list.onRefreshComplete();


            } catch (Exception e) {
                Log.d("TodayNo_Error", e.getMessage());
            }


        }

        /**
         * 서버와 연결된 스트림으로부터 텍스트를 읽어들입니다.
         *
         * @param in 서버와 연결된 입력 스트림
         * @return 서버로부터 읽은 텍스트
         */

        private String getTextFrom(InputStream in) {
            StringBuilder sb = new StringBuilder();
            BufferedReader br = null;

            try {
                br = new BufferedReader(new InputStreamReader(in));

                // 스트림으로부터 라인 단위로 자료를 읽어 옵니다.
                while (true) {
                    String line = br.readLine();
                    if (null == line) break;
                    sb.append(line + '\n');
                }
            } catch (IOException e) {
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

    //[출처] [Android] Fragment에서 Back Key Event 처리|작성자 양양이
}