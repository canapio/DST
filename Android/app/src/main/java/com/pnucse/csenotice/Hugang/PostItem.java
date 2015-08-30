package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.pnucse.csenotice.Hugang.R;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by Dong on 2015-05-21.
 */
public class PostItem {

    private Drawable mIcon;
    private String[] mData;
    private boolean isNew;
    private boolean mSelectable = true;
    private int order;

    public PostItem(Drawable icon, String[] obj, boolean aNew){
        mIcon = icon;
        mData = obj;
        isNew = aNew;
    }

    public PostItem(Drawable icon, String obj01, String obj02, boolean aNew, String aorder , String url) {
        mIcon = icon;

        mData = new String[4];

        //게시글 이름
        mData[0] = obj01;

        //강의 id
        mData[1] = obj02;

        //order
        order = Integer.parseInt(aorder);

        isNew = aNew;

        //post url
        mData[2]=url;
    }

    public boolean isSelectable() {
        return mSelectable;
    }

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

    public int getOrder(){
        return order;
    }
    public void setData(String[] obj){
        mData=obj;
    }

    public void setIcon(Drawable icon){
        mIcon=icon;
    }

    public Drawable getIcon() {
        return mIcon;
    }


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


class PostView extends LinearLayout {
    private ImageView mIcon;

    private TextView mText01;

    CustomApplication app;

    public PostView(Context context, PostItem aItem) {
        super(context);

        // Layout Inflation
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.item_post, this, true);


        app = (CustomApplication) context.getApplicationContext();
        // Set Icon
        mIcon = (ImageView) findViewById(R.id.post_img);
        mIcon.setImageDrawable(aItem.getIcon());

        // Set Text 01
        mText01 = (TextView) findViewById(R.id.post_name);
        mText01.setText(aItem.getData(0));
    }

    public void setText(int index, String data) {
        if (index == 0) {
            mText01.setText(data);
        } else {
            throw new IllegalArgumentException();
        }
    }


    public void setIcon(Drawable icon) {
        mIcon.setImageDrawable(icon);
    }



}

class PostAdapter extends BaseAdapter{
    private Context mContext;
    // infalter;
    private List<PostItem> mItems =new ArrayList<PostItem>();

    public PostAdapter(Context context){
        mContext = context;
        // infalter = (LayoutInflater)context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
    }

    public void additem(PostItem it){
        mItems.add(it);
        Collections.sort(mItems, new myComparator());
    }

    public void setListItems(List<PostItem> lit){
        mItems = lit;
    }

    public int getCount() {
        return mItems.size();

    }
    public class myComparator implements Comparator<PostItem> {

        //private final Collator collator = Collator.getInstance();
        @Override
        public int compare(PostItem lhs, PostItem rhs) {
            int o1 = lhs.getOrder();
            int o2 = rhs.getOrder();
            return (o1>o2? -1 : (o1==o2 ? 0 : 1));
        }
    };

    public Object getItem(int position) {
        return mItems.get(position);
    }

    public boolean areAllItemsSelectable() {
        return false;
    }


    public boolean isSelectable(int position) {
        try {
            return mItems.get(position).isSelectable();
        } catch (IndexOutOfBoundsException ex) {
            return false;
        }
    }

    public long getItemId(int position) {
        return position;
    }

    public void clear(){
        mItems.clear();
    }
    public View getView(int position, View convertView, ViewGroup parent) {
        PostView itemView = null;

        if (convertView == null){
            itemView = new PostView(mContext, mItems.get(position));
            // itemView = infalter.inflate(R.layout.listitem_prof,parent,false);
        }else {
            itemView = (PostView) convertView;

        }

        itemView.setIcon(mItems.get(position).getIcon());
        itemView.setText(0, mItems.get(position).getData(0));

        return itemView;
    }

}

