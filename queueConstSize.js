var client = require("redis").createClient();

function lpushToQueue(queue_name,val, max_length){
  client.lpush(queue_name,val);
  var len;
  client.lrange(queue_name,0,-1,function(err,queue_content){
    len = queue_content.length;
    console.log("len = "+len+" maxlen = "+max_length);
    if(len>max_length){
      client.rpop(queue_name,function(err,msg){
        console.log("popped : "+msg);
      });
    }
  });
}

function rpopFromQueue(queue_name){
  client.lrange(queue_name,0,-1,function(err,queue_content){
    if(queue_content.length!=0){
      client.rpop(queue_name,function(err,msg){
        console.log("popped : "+msg);
      });
    }
    else{
      console.log("cant pop as the queue is empty");
    }
  });
}

function printQueue(queue_name){
  client.lrange(queue_name,0,-1,function(err,queue_content){
    console.log(queue_content);
  });
}

function playWdQueue(){
  var queue_name = "name";
  var max_length = 5;
  var i = 0;
  var timer = setInterval(function(){
    i++;
    lpushToQueue(queue_name,i,max_length);
    printQueue(queue_name);
    if(i===10){
      clearInterval(timer);
    }
  },5000);
  setTimeout(function(){
    printQueue(queue_name);
  },10000);
}

playWdQueue();
