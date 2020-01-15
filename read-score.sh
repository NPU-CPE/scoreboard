#!/bin/bash

while true; do

#users=`docker exec gtypist find /home/ -name '.gtypist'|awk -F '/' '{print $3}'`

users=`docker exec gtypist who|awk '{print $1}'|sort|uniq`


echo "users,date,exam,wpm,adj_wpm,error" > a.txt
for u in ${users}; do
 score=`docker exec gtypist cat /home/${u}/.gtypist |grep '_S_R_L'|tail -1`
 DATE=`echo $score|awk '{print $1,$2,$3,$4,$5}'`
 LESSON=`echo $score|awk '{print $6}'`
 SCORE=`echo $score|awk '{if (!$8) {print 0","0","0} else {print $8","$9","$10}}'`
 echo $u,$DATE,$LESSON,$SCORE >> a.txt
done

#jq -r -s -R -f filter.jq a.txt  > /var/www/html/sp/data.json
#jq -r -s -R -f filter.jq a.txt  > data.json
jq -r -s -R -f filter.jq a.txt|jq 'sort_by(-.wpm)'  > data.json
#jq -r -s -R -f filter.jq a.txt|jq 'sort_by(-.wpm)'  
#jq -r -s -R -f filter.jq a.txt  

sleep 5
done
