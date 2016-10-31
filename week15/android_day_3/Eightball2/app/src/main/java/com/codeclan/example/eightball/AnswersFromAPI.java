package com.codeclan.example.eightball;

import android.util.Log;

import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.AsyncHttpClient;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by user on 03/08/2016.
 */
public class AnswersFromAPI extends Answers {
    private final static String API_URL="https://craggy-island-8-ball-api.herokuapp.com/";

    public void setupAnswers() {
        AsyncHttpClient client = new AsyncHttpClient();
        client.get(API_URL, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(JSONObject jsonObject) {
                Log.d("EightBall:", jsonObject.toString());
                JSONArray jsonAnswers = jsonObject.optJSONArray("answers");
                if(jsonAnswers != null) {
                    for (int i = 0; i < jsonAnswers.length(); i++) {
                        JSONObject jsonAnswer = jsonAnswers.optJSONObject(i);
                        if (jsonAnswer.has("text")) {
                            Log.d("EightBall:", jsonAnswer.toString());
                            String answer = jsonAnswer.optString("text");
                            Log.d("EightBall", answer);
                            add(answer);
                        }
                    }
                }
            }
            @Override
            public void onFailure(int statusCode, Throwable throwable, JSONObject error) {
                Log.e("EightBall:", "failure" + statusCode + " " + throwable.getMessage());
            }

        });
    }
}
