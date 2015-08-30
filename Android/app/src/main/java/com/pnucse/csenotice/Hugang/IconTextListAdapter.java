package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by Dong on 2015-04-10.
 */
public class IconTextListAdapter extends BaseAdapter {

    private Context mContext;

    public List<IconTextItem> mItems =new ArrayList<IconTextItem>();
    //private List<IconTextItem> orderitem = new ArrayList<IconTextItem>();

    public IconTextListAdapter(Context context){
        mContext = context;
    }

    public IconTextListAdapter(Context context,List<IconTextItem> aList){
        mItems = aList;
        mContext = context;
    }
    public void additem(IconTextItem it){
        mItems.add(it);
        Collections.sort(mItems, new myComparator());
    }

    public void setListItems(List<IconTextItem> lit){
        mItems = lit;
    }

    public int getCount() {
        return mItems.size();

    }


/*
    @Override
    public boolean isEnabled(int position) {
        if (mContext.getDrawable(R.drawable.icon_status_d)==mItems.get(position).getIcon2())
            return false;
        else
            return true;
    }
*/

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

    public void clear() {
        Log.v("rdeor","start------------");
        mItems.clear();
    }

    @Override
    public boolean areAllItemsEnabled()
    {

        return false;

    }

    @Override
    public boolean isEnabled(int position)
    {

    if (mItems.get(position).getonwork()) return true;
        else return false;
    }

    public long getItemId(int position) {
        return position;
    }

    public class myComparator implements Comparator<IconTextItem>{

        //private final Collator collator = Collator.getInstance();
        @Override
        public int compare(IconTextItem lhs, IconTextItem rhs) {
            int o1 = lhs.getOrder();
            int o2 = rhs.getOrder();
            return (o1>o2? -1 : (o1==o2 ? 0 : 1));
        }
    };

    public View getView(int position, View convertView, ViewGroup parent) {
        IconTextView itemView;

        if (convertView == null) {
            itemView = new IconTextView(mContext, mItems.get(position));
        } else {
            itemView = (IconTextView) convertView;

            itemView.setIcon(mItems.get(position).getIcon());
            itemView.setText(0, mItems.get(position).getData(0));
            itemView.setText(1, mItems.get(position).getData(1));
//            itemView.setText(2, mItems.get(position).getData(2));
            itemView.setIcon2(mItems.get(position).getIcon2());
        }

        return itemView;
    }



}

