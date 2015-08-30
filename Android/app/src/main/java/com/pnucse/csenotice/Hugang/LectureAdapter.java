package com.pnucse.csenotice.Hugang;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Created by Dong on 2015-05-13.
 */
public class LectureAdapter extends BaseAdapter {

    private Context mContext;
    // infalter;
    private List<LectureItem> mItems =new ArrayList<LectureItem>();

    public LectureAdapter(Context context){
        mContext = context;
       // infalter = (LayoutInflater)context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
    }

    public void additem(LectureItem it){
        mItems.add(it);
        Collections.sort(mItems, new myComparator());
    }

    public void setListItems(List<LectureItem> lit){
        mItems = lit;
    }

    public int getCount() {
        return mItems.size();

    }

    public Object getItem(int position) {
        return mItems.get(position);
    }

    public boolean areAllItemsSelectable() {
        return false;
    }

    public void clear() {
        mItems.clear();
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

    public class myComparator implements Comparator<LectureItem> {

        //private final Collator collator = Collator.getInstance();
        @Override
        public int compare(LectureItem lhs, LectureItem rhs) {
            int o1 = lhs.getOrder();
            int o2 = rhs.getOrder();
            return (o1>o2? -1 : (o1==o2 ? 0 : 1));
        }
    };

    public View getView(int position, View convertView, ViewGroup parent) {
        LectureView itemView = null;
/*
        if (convertView == null){
            itemView = new LectureView(mContext, mItems.get(position));
           // itemView = infalter.inflate(R.layout.listitem_prof,parent,false);
        }else {
            itemView = (LectureView) convertView;


        }
        */
        itemView = new LectureView(mContext, mItems.get(position));


        itemView.setIcon(mItems.get(position).getIcon());
        itemView.setText(0, mItems.get(position).getData(0));
        itemView.setText(1, mItems.get(position).getData(1));
//            itemView.setText(2, mItems.get(position).getData(2));
        //itemView.setIcon2(mItems.get(position).getIcon2());
        itemView.setTag(position);

        return itemView;
    }



}
