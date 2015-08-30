package com.pnucse.csenotice.Hugang;

import android.app.AlertDialog;
import android.app.ListActivity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

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
import java.util.ArrayList;
import java.util.List;


public class NoticeActivity extends ListActivity
{
    SpeechListAdapter adapter;
    Boolean InternetAvailable = false;
    Seocnd detectconnection;

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        
        Log.d("onCreate","on");
        adapter = new SpeechListAdapter(this);
        // Use our own list adapter
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



    }

    @Override
    public void onStart(){
        super.onStart();
       // setContentView(R.layout.activity_notice);
        Connect ct = new Connect();
        ct.execute(AppInfo.ParsingURL+"noticelist");
    }
    /*
     * (non-Javadoc)
     * @see android.app.ListActivity#onListItemClick(android.widget.ListView, android.view.View, int, long)
     *
     * 리스트 항목을 눌렀을때 사용자 정의 어댑터의 toggle 메소드에 현재 선택한 항목의
     * 인덱스 값을 넘겨서 내용이 펼치졌다가 접었다가, 항목을 누를때마다 반복하게 됩니다.
     */
    @Override
    protected void onListItemClick(ListView l, View v, int position, long id)
    {
        ((SpeechListAdapter)getListAdapter()).toggle(position);
    }

    /**
     * A sample ListAdapter that presents content
     * from arrays of speeches and text.
     *
     */
    private class SpeechListAdapter extends BaseAdapter {
        public int count = 0;
        public SpeechListAdapter(Context context)
        {
            mContext = context;
        }


        public void additem(String name, String text, boolean bool){
            mTitles.add(name);
            mDialogue.add(text);
            mExpanded.add(false);
        }
        /**
         * The number of items in the list is determined by the number of speeches
         * in our array.
         *
         * @see android.widget.ListAdapter#getCount()
         */
        public int getCount() {
            return mTitles.size();
        }

        /**
         * Since the data comes from an array, just returning
         * the index is sufficent to get at the data. If we
         * were using a more complex data structure, we
         * would return whatever object represents one
         * row in the list.
         *
         * @see android.widget.ListAdapter#getItem(int)
         */
        public Object getItem(int position) {
            return position;
        }

        /**
         * Use the array index as a unique id.
         * @see android.widget.ListAdapter#getItemId(int)
         */
        public long getItemId(int position) {
            return position;
        }

        /**
         * Make a SpeechView to hold each row.
         * @see android.widget.ListAdapter#getView(int, android.view.View, android.view.ViewGroup)
         */
        public View getView(int position, View convertView, ViewGroup parent) {
            SpeechView sv;
            if (convertView == null) {
                sv = new SpeechView(mContext, mTitles.get(position), mDialogue.get(position), (boolean)mExpanded.get(position) );
            } else {
                sv = (SpeechView)convertView;
                sv.setTitle(mTitles.get(position));
                sv.setDialogue(mDialogue.get(position));
                //실제 내용이 펼쳐졌다가 접게되는 처리를 하고 있습니다.
                sv.setExpanded((boolean)mExpanded.get(position) );
            }

            return sv;
        }

        /*
         * 리스트의 항목을 눌렀을때 이 메소드가 호출됩니다.
         */
        public void toggle(int position) {
            mExpanded.set(position,!(boolean)mExpanded.get(position));
            notifyDataSetChanged();
        }

        /**
         * Remember our context so we can use it when constructing views.
         */
        private Context mContext;

        /**
         * Our data, part 1.
         */
        public List<String> mTitles =new ArrayList<String>();

        public List<String> mDialogue=new ArrayList<String>();
        /**
         * Our data, part 3.
         */
        //private boolean[] mExpanded = new boolean[10];

        public List<Boolean> mExpanded = new ArrayList<Boolean>();
    }

    /**
     * We will use a SpeechView to display each speech. It's just a LinearLayout
     * with two text fields.
     *
     * 리스트의 각 항목을 채우는 레이아웃 입니다.
     * 제목과 내용 텍스트뷰 두개를 배치하고, 처음에 내용 텍스트뷰를 안보이도록 설정합니다.
     * 그리고 외부에서 setExpanded 메소드를 호출하면, true/false 값에 따라서
     * 내용 텍스트뷰를 펼쳤다가 접었다가 처리를 호출시마다 반복하게 됩니다.
     */
    private class SpeechView extends LinearLayout {
        public SpeechView(Context context, String title, String dialogue, boolean expanded) {
            super(context);

            this.setOrientation(VERTICAL);

            // Here we build the child views in code. They could also have
            // been specified in an XML file.

            mTitle = new TextView(context);
            mTitle.setText(title);
            mTitle.setTextSize(15);
            mTitle.setTypeface(null, Typeface.BOLD_ITALIC);
            mTitle.setPadding(5,5,5,5);
            addView(mTitle, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));

            mDialogue = new TextView(context);
            mDialogue.setText(dialogue);
            addView(mDialogue, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));

            mDialogue.setVisibility(expanded ? VISIBLE : GONE);
        }

        /**
         * Convenience method to set the title of a SpeechView
         */
        public void setTitle(String title) {
            mTitle.setText(title);
        }

        /**
         * Convenience method to set the dialogue of a SpeechView
         */
        public void setDialogue(String words) {
            mDialogue.setText(words);
        }

        /**
         * Convenience method to expand or hide the dialogue
         */
        public void setExpanded(boolean expanded) {
            mDialogue.setVisibility(expanded ? VISIBLE : GONE);
        }

        private TextView mTitle;
        private TextView mDialogue;
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_notice, menu);
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

            // 주소로부터 URL 객체 생성
            try {
                url = new URL(params[0]);
            } catch (MalformedURLException e) {
                e.printStackTrace();
                return "사용할 수 있는 인터넷 주소가 아닙니다." ;
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
            //input01 .setText(result);
            //adapter.clear();
            Log.d("Hugang_Notice_result",result);
            try {
                //Log.d("JSON","JSONObject");
                JSONObject jobj = new JSONObject(result);
                //if (jobj.getString("errcode") != "0") break;
                JSONObject data = jobj.getJSONObject("data");
                JSONArray dataarr = data.getJSONArray("list");

                Resources res = getResources();
                for (int i = 0; i < dataarr.length(); i++) {
                    Log.d("TodayNo_length", Integer.toString(dataarr.length()));
                    String name = null;
                    String id = null;
                    String des = null;
                    int order = 0;
                    data = dataarr.getJSONObject(i);
                    if (data.has("title") && data.has("_id")) {
                        name = data.getString("title");
                        id = data.getString("_id");
                        if (data.has("description"))
                            des = data.getString("description");

                    } else {
                        continue;
                    }


                    adapter.additem(name, des, false);

                    Log.d("Hugang_Notice_name",name);

                    setListAdapter(adapter);
                }


            } catch (Exception e) {
                Log.d("TodayNo_JSONError", e.getMessage());
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

