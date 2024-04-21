import processing.serial.*;
import processing.sound.*;
import http.requests.*; 
import ddf.minim.*;

Serial myPort;
String[] val;
SoundFile file_1, file_2, file_3, file_4, file_5;
String domain = "yogahacktest.kintone.com";
String appID = "3";
String apiToken = "xi278sPuBQOIqVLrQ6IHBMA3BNHUBiMWXGwqvzzK";
String url = "https://" + domain + "/k/v1/record.json"; // URL for creating records
boolean test=false;
Minim minim;
AudioPlayer player;
void setup() {
  String portName = "COM3";
  myPort = new Serial(this, portName, 9600);
  size(640, 360);
  
  file_1 = new SoundFile(this, "FSR.mp3");
  file_2 = new SoundFile(this, "Flex_Positive.mp3");
  file_3 = new SoundFile(this, "Flex_Positive_2.mp3");
  file_4 = new SoundFile(this, "FSR_End.mp3");
  minim = new Minim(this);
  player = minim.loadFile("loopMusic.mp3", 2048);
  player.loop();
}

void draw() {
  if (myPort.available() > 0) {
    String valAll = myPort.readStringUntil('\n');
    if (valAll != null) {
      println(valAll);
      val = split(valAll, ',');
      if (val != null && val.length >= 4) {
        float FLEX_1  = float(val[0]);
        float FLEX_2  = float(val[1]);
        float FSR_2 = float(val[2]);
        float FSR_1= float(val[3]);
        String jsonData = "{"
                    + "\"app\":\"" + appID + "\","
                    + "\"record\":{"
                    + "\"Text\":{\"value\":"+FSR_1+"},"  
                    + "\"Text_0\":{\"value\":"+FLEX_1+"}," 
                    + "\"Text_1\":{\"value\":"+FSR_2+"},"  
                    + "\"Text_2\":{\"value\":"+FLEX_2+"}"   
                    + "}"
                    + "}";


        if (FSR_1 < 500 &&  FSR_2 <500 
        && !file_1.isPlaying() && !file_2.isPlaying()
        && !file_3.isPlaying() && !file_4.isPlaying() && !test) 
        {
        file_1.play();
        test=true;
        }
        
        if (FSR_1 == 1023 &&  FSR_2 ==1023 
         && test) 
        {
        file_4.play();
        test=false;
        }
        if (FLEX_1 < 800 && !file_2.isPlaying()) file_2.play();
        //if (FSR_2 < 500 && !file_3.isPlaying()) file_3.play();
        if (FLEX_2 < 800  && !file_3.isPlaying()) file_3.play();
       // if(FSR_1>900 && FSR_1<=1022 && FSR_2>900 && FSR_2<=1022 &&
       // !file_1.isPlaying() && !file_4.isPlaying())file_4.play();
        
        PostRequest post = new PostRequest(url);
        post.addHeader("X-Cybozu-API-Token", apiToken);
        post.addHeader("Content-Type", "application/json");
        post.addHeader("Accept", "application/json");
        post.addData(jsonData);
        post.send(); // Send the request
        String response = post.getContent();
        println("Response from server: " + response); 
       }
    }
  }
}
