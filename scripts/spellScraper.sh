
#Takes the URL and gets the name, cast, recast, type, and level, and parses them into the values on new lines with quotation marks between
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
# gets the names and level of every trait (seperated from the other actions since they only have name and level)
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
#Gets the effect of both actions and traits
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
#Gets the icons of both actions and traits
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
#reset the JSON file
 > XIVFinal.json
 #get the length of the actions
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
#get the length of the traits
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
#count for the actual number of spells
count=1
#count for the number times 5 to account for the 5 different values in each spell
extraCount=1
#open brackets
echo "{" >> XIVFinal.json
echo "  \"paladin\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
#Loop through all of the values in the actions file
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    #get icon
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    #get name
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get level
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get type
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get cast time
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get recast time
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get cost
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    #get the effect
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    #checks if it needs a comma or if it's the last value
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"warrior\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"darkknight\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"gunbreaker\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"whitemage\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json


#Add scholar with pet actions

#Add astrologian with Arcana


curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"sage\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json


curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed -n '/trait_action/,/Changing Form/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/Changing Form/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/Changing Form/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"monk\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"dragoon\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json


#Ninja, needs Ninjutsu (Combo Sequence)

#Samurai, needs Iaijutsu (Combo Sequence)


curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"reaper\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"bard\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"machinist\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

# Add Dancer, needs step actions

curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"blackmage\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }," >> XIVFinal.json

 #Add Summoner, needs pet actions

 curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
spellCount=$( wc -l < XIVNums.txt )
spellCount=$((spellCount))
traitCount=$( wc -l < XIVTraits.txt )
traitCount=$((traitCount))
count=1
extraCount=1

echo "  \"redmage\": {" >> XIVFinal.json
echo "      \"actions\": [" >> XIVFinal.json
while [ $extraCount -le $spellCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"type\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"recast\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"cost\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVNums.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $spellCount ]
    then
        echo "          }," >> XIVFinal.json

    else
        echo "          }" >> XIVFinal.json

    fi
done
echo "      ]," >> XIVFinal.json
extraCount=1
echo "      \"traits\": [" >> XIVFinal.json
while [ $extraCount -le $traitCount ];
do
    echo "          {" >> XIVFinal.json
    echo -n "               \"icon\": " >> XIVFinal.json
    sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
    echo -n "               \"name\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"level\": " >> XIVFinal.json
    sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
    extraCount=$((extraCount+1))
    echo -n "               \"effect\": " >> XIVFinal.json
    sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
    count=$((count+1))
    if [ $extraCount -lt $traitCount ]
    then
        echo "          }," >> XIVFinal.json
    else
        echo "          }" >> XIVFinal.json
    fi
done

    echo "      ]" >> XIVFinal.json
echo "  }" >> XIVFinal.json

# add blue mage? 


echo "}" >> XIVFinal.json