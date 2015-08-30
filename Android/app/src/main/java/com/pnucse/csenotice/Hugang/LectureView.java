package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.pnucse.csenotice.Hugang.R;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dong on 2015-05-13.
 */
public class LectureView extends LinearLayout {

    /**
     * Icon
     */
    private ImageView mIcon;

    /**
     * TextView 01
     */
    private TextView mText01;

    /**
     * TextView 02
     */
    private TextView mText02;

    /**
     * TextView 03
     */
    private TextView mText03;

    private ToggleButton tb;

   // private ImageView mIcon2;

    CustomApplication app;


    public LectureView(Context context, LectureItem aItem) {
        super(context);

        // Layout Inflation
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.item_lecture, this, true);


        app = (CustomApplication)context.getApplicationContext();
        // Set Icon
        mIcon = (ImageView) findViewById(R.id.lect_img);
        mIcon.setImageDrawable(aItem.getIcon());

        // Set Text 01
        mText01 = (TextView) findViewById(R.id.lect_name);
        mText01.setText(aItem.getData(0));

        // Set Text 02
        mText02 = (TextView) findViewById(R.id.lect_tab_num);
        mText02.setText(aItem.getData(1));

        final LectureItem item = aItem;

        tb = (ToggleButton)findViewById(R.id.lect_fav);
       // tb.setTag(position);
        tb.setFocusable(false);
        tb.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (tb.isChecked()){
                    //tb.setBackgroundDrawable();
                    Toast.makeText(getContext(), "즐겨찾기 추가", Toast.LENGTH_SHORT).show();
                    app.setMap_lect_item(item.getData(2),item);
                    new SendPostReqAsyncTask().execute(item.getData(2),"y");
                }
                else {
                    Toast.makeText(getContext(),"즐겨찾기 해제",Toast.LENGTH_SHORT).show();
                    app.delMap_lect_item(item.getData(2));
                    new SendPostReqAsyncTask().execute(item.getData(2),"n");
                }
            }
        });

        if (aItem.getStar())
            tb.setChecked(true);





    }

    public void setTag(int index){
        tb.setTag(index);
    }
    /**
     * set Text
     *
     * @param index
     * @param data
     */
    public void setText(int index, String data) {
        if (index == 0) {
            mText01.setText(data);
        } else if (index == 1) {
            mText02.setText(data);
        } else {
            throw new IllegalArgumentException();
        }
    }

    /**
     * set Icon
     *
     * @param icon
     */
    public void setIcon(Drawable icon) {
        mIcon.setImageDrawable(icon);
    }


    class SendPostReqAsyncTask extends AsyncTask<String, Void, String> {

        @Override
        protected String doInBackground(String... params) {

            String url1 = AppInfo.ParsingURL + "setpushid";
            String pushid = app.getPushid();
            String lect_id = params[0];
            String onoff = params[1];

            Log.d("push",pushid);
            //System.out.println("*** doInBackground ** paramUsername " + paramUsername + " paramPassword :" + paramPassword);

            HttpClient httpClient = new DefaultHttpClient();

            // In a POST request, we don't pass the values in the URL.
            //Therefore we use only the web page URL as the parameter of the HttpPost argument
            HttpPost httpPost = new HttpPost(url1);

            // Because we are not passing values over the URL, we should have a mechanism to pass the values that can be
            //uniquely separate by the other end.
            //To achieve that we use BasicNameValuePair
            //Things we need to pass with the POST request
            BasicNameValuePair pushidValuePair = new BasicNameValuePair("pushid", pushid);
            BasicNameValuePair lectureidValuePair = new BasicNameValuePair("lecture_id", lect_id);
            BasicNameValuePair statusValuePAir = new BasicNameValuePair("status", onoff);

            // We add the content that we want to pass with the POST request to as name-value pairs
            //Now we put those sending details to an ArrayList with type safe of NameValuePair
            List<NameValuePair> nameValuePairList = new ArrayList<NameValuePair>();
            nameValuePairList.add(pushidValuePair);
            nameValuePairList.add(lectureidValuePair);
            nameValuePairList.add(new BasicNameValuePair("platform","android"));
            nameValuePairList.add(statusValuePAir);



            try {
                // UrlEncodedFormEntity is an entity composed of a list of url-encoded pairs.
                //This is typically useful while sending an HTTP POST request.
                UrlEncodedFormEntity urlEncodedFormEntity = new UrlEncodedFormEntity(nameValuePairList);

                // setEntity() hands the entity (here it is urlEncodedFormEntity) to the request.
                httpPost.setEntity(urlEncodedFormEntity);

                try {
                    // HttpResponse is an interface just like HttpPost.
                    //Therefore we can't initialize them
                    HttpResponse httpResponse = httpClient.execute(httpPost);

                    // According to the JAVA API, InputStream constructor do nothing.
                    //So we can't initialize InputStream although it is not an interface
                    InputStream inputStream = httpResponse.getEntity().getContent();

                    InputStreamReader inputStreamReader = new InputStreamReader(inputStream);

                    BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                    StringBuilder stringBuilder = new StringBuilder();

                    String bufferedStrChunk = null;

                    while((bufferedStrChunk = bufferedReader.readLine()) != null){
                        stringBuilder.append(bufferedStrChunk);
                    }
                    Log.d("response",stringBuilder.toString());
                    String res = stringBuilder.toString();
                    JSONObject obj = new JSONObject(res);



                    return obj.getString("errmsg");

                } catch (ClientProtocolException cpe) {
                    System.out.println("First Exception caz of HttpResponese :" + cpe);
                    cpe.printStackTrace();
                } catch (IOException ioe) {
                    System.out.println("Second Exception caz of HttpResponse :" + ioe);
                    ioe.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            } catch (UnsupportedEncodingException uee) {
                System.out.println("An Exception given because of UrlEncodedFormEntity argument :" + uee);
                uee.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            if(result.equals("success")){
                //Toast.makeText(getContext(), , Toast.LENGTH_LONG).show();
            }else{
                Toast.makeText(getContext(), "Invalid POST req...", Toast.LENGTH_LONG).show();
            }
        }
    }




}

class LectureItem {

    private Drawable mIcon;
    private String[] mData;
    private boolean isNew;
    private boolean star;
    private int order;
    //private Drawable mIcon2;

    public LectureItem(Drawable icon, String[] obj, boolean aNew){
        mIcon = icon;
        mData = obj;
        isNew = aNew;
    }

    private boolean mSelectable = true;

    public LectureItem(Drawable icon, String obj01, String obj02, String obj03, boolean aNew, int aorder, boolean astar,String url_lect) {
        mIcon = icon;

        mData = new String[4];

        //강의 이름
        mData[0] = obj01;

        //게시글 개수
        mData[1] = obj02;

        //강의 id
        mData[2] = obj03;

        //order
        order = aorder;


        isNew = aNew;

        star = astar;

        //url
        mData[3]= url_lect;
    }



    public boolean isSelectable() {
        return mSelectable;
    }

    /**
     * Set selectable flag
     */
    public void setSelectable(boolean selectable) {
        mSelectable = selectable;
    }

    public String[] getData() {
        return mData;
    }

    public String getData(int index){
        if (mData == null || index >= mData.length){
            return null;
        }

        return mData[index];
    }

    public boolean getStar() { return star; }

    public void setData(String[] obj){
        mData=obj;
    }

    public void setIcon(Drawable icon){
        mIcon=icon;
    }

    public int getOrder(){
        return order;
    }
    public Drawable getIcon() {
        return mIcon;
    }

   // public Drawable getIcon2() { return mIcon2;}

    public int compareTo(LectureItem other) {
        if (mData != null) {
            String[] otherData = other.getData();
            if (mData.length == otherData.length) {
                for (int i = 0; i < mData.length; i++) {
                    if (!mData[i].equals(otherData[i])) {
                        return -1;
                    }
                }
            } else {
                return -1;
            }
        } else {
            throw new IllegalArgumentException();
        }

        return 0;
    }


}