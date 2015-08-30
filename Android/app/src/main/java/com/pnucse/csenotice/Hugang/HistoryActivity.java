package com.pnucse.csenotice.Hugang;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

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
import java.util.ArrayList;
import java.util.List;

import eu.erikw.PullToRefreshListView;


public class HistoryActivity extends ActionBarActivity {

    PullToRefreshListView Historylist;
    HistoryAdapter adapter;
    CustomApplication app;
    Boolean InternetAvailable = false;
    Seocnd detectconnection;
    MySQLiteHandler handler;


    @Override
    public void onStart(){
        super.onStart();
        setContentView(R.layout.activity_history);

        AlertDialog.Builder alert = new AlertDialog.Builder(HistoryActivity.this);
        alert.setPositiveButton("확인", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                moveTaskToBack(true);
                dialog.dismiss();     //닫기
            }
        });
        alert.setMessage("인터넷 연결 해야 되용");

        ActionBar abar = this.getSupportActionBar();
        abar.setTitle("푸시 히스토리");
        abar.setDisplayOptions(ActionBar.DISPLAY_SHOW_TITLE);

        app = (CustomApplication)this.getApplication();

        Historylist = (PullToRefreshListView)findViewById(R.id.hist_list);
        adapter = new HistoryAdapter(this);

        Historylist.setAdapter(adapter);

        Historylist.setRefreshing();
        if ( Historylist.isRefreshing()) {
            Connect ct = new Connect();
            ct.execute(AppInfo.ParsingURL + "pushhistorylist",app.getPushid());
        }

        Historylist.setOnRefreshListener(new PullToRefreshListView.OnRefreshListener() {

            @Override
            public void onRefresh() {
                // Your code to refresh the list contents goes here
                Connect ct = new Connect();
                ct.execute(AppInfo.ParsingURL + "pushhistorylist",app.getPushid());

            }
        });

    }



    class Connect extends AsyncTask<String, Void, String> {
        @Override
        protected void onPreExecute() {

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
                Log.d("Hugang_doInBack_pushid", push_id);
                String query = String.format("pushid=%s", URLEncoder.encode(push_id, "UTF-8"));
                String query1 = String.format("platform=%s",URLEncoder.encode("android", "UTF-8"));
                url = new URL(params[0] + "?" + query+"&"+query1);
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
            handler = MySQLiteHandler.open(getApplicationContext());
            handler.removeAll();
            handler.close();
            //input01 .setText(result);

            try {
                Log.d("Hugang_JSON","result" + result);
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                JSONArray dataarr = null;
                if (data.has("list")) {
                    dataarr = data.getJSONArray("list");
                    Log.d("Hugang", dataarr.toString());
                }
                else {
                    Historylist.onRefreshComplete();

                }
                //Log.d("Hugang_JSON","JSONObject2");

                for (int i = 0; i< dataarr.length(); i++){
                    String name = null;
                    String id = null;
                    //String count = null;
                    String order = null;

                    name = dataarr.getString(i);
                    adapter.additem(name);
                    Log.d("Hugang_url", name);
                    handler = MySQLiteHandler.open(getApplicationContext());
                    handler.insert(name);
                    handler.close();
                    //adapter.additem(new IconTextItem(res.getDrawable(R.drawable.thum_professor),name,count + "개의 탭이 있습니다",res.getDrawable(R.drawable.green_light),id));
                }

                Historylist.onRefreshComplete();


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



    public List<String> mTitles =new ArrayList<String>();


}


class HistoryAdapter extends BaseAdapter {
    private Context mContext;
    // infalter;
    private List<String> mItems =new ArrayList<String>();

    public HistoryAdapter(Context context){
        mContext = context;
        // infalter = (LayoutInflater)context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
    }

    public void additem(String it){
        mItems.add(it);
       // Collections.sort(mItems, new myComparator());
    }

    public void setListItems(List<String> lit){
        mItems = lit;
    }

    public int getCount() {
        return mItems.size();

    }
    /*
    public class myComparator implements Comparator<String> {

        //private final Collator collator = Collator.getInstance();
        @Override
        public int compare(PostItem lhs, PostItem rhs) {
            int o1 = lhs.getOrder();
            int o2 = rhs.getOrder();
            return (o1>o2? -1 : (o1==o2 ? 0 : 1));
        }
    };*/

    public Object getItem(int position) {
        return mItems.get(position);
    }

    public boolean areAllItemsSelectable() {
        return false;
    }



    public long getItemId(int position) {
        return position;
    }

    public void clear(){
        mItems.clear();
    }
    public View getView(int position, View convertView, ViewGroup parent) {
        HistoryView itemView = null;

        if (convertView == null){
            itemView = new HistoryView(mContext, mItems.get(position));
            // itemView = infalter.inflate(R.layout.listitem_prof,parent,false);
        }else {
            itemView = (HistoryView) convertView;

        }

        itemView.setText(0, mItems.get(position));

        return itemView;
    }

}


class HistoryView extends LinearLayout {

    private TextView mText01;

    CustomApplication app;

    public HistoryView(Context context, String aItem) {
        super(context);

        // Layout Inflation
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.item_post, this, true);


        app = (CustomApplication) context.getApplicationContext();

        // Set Text 01
        mText01 = (TextView) findViewById(R.id.post_name);
        mText01.setText(aItem);
    }

    public void setText(int index, String data) {
        if (index == 0) {
            mText01.setText(data);
        } else {
            throw new IllegalArgumentException();
        }
    }

}
