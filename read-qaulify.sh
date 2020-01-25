#!/bin/bash

while true; do

users=`docker exec gtypist find /home/ -name '.gtypist'|awk -F '/' '{print $3}'`
#users=`docker exec gtypist who|awk '{print $1}'|sort|uniq`


echo "users,date,exam,wpm,adj_wpm,error,online" > a.txt
for u in ${users}; do
 score=`docker exec gtypist cat /home/${u}/.gtypist |grep '_S_R_L28'|tail -1`
 #score=`docker exec gtypist cat /home/${u}/.gtypist |grep '_S_R_NPU1'|tail -1`
 
 DATE=`echo $score|awk '{print $1,$2,$3,$4,$5}'`
 LESSON=`echo $score|awk '{print $6}'`
 SCORE=`echo $score|awk '{if (!$8) {print 0","0","0} else {print $8","$9","$10}}'`

# docker exec gtypist w|grep -v USER|grep -v days|awk '{print $1}' > online.txt
 docker exec gtypist users|sed 's/ /\n/g'|sort|uniq > online.txt
 ONLINE_CHECK=`sed "s/^${u}/ONLINE/g" online.txt|grep ONLINE`

 if [ -z "$ONLINE_CHECK" ]; then 
   ONLINE='NO'
   ONLINE_CHECK='NO'
 fi

 if [ ${ONLINE_CHECK} = "ONLINE" ]; then
   ONLINE='YES'
 else
   ONLINE='NO'
 fi

 if [ "${LESSON}" = "*:_S_R_L28" ]; then
  echo $u,$DATE,$LESSON,$SCORE,$ONLINE >> a.txt
 fi
done

#jq -r -s -R -f filter.jq a.txt  > /var/www/html/sp/data.json
#jq -r -s -R -f filter.jq a.txt  > data.json
#jq -r -s -R -f filter.jq a.txt|jq 'sort_by(-.adj_wpm)'  
#jq -r -s -R -f filter.jq a.txt  

jq -r -s -R -f filter.jq a.txt|jq 'sort_by(-.adj_wpm)'  > data.json
#jq -r -s -R -f filter.jq a.txt|jq 'sort_by(-.adj_wpm)' 

#sleep 2
done
