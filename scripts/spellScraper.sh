function outputFile(){
    #get the length of the actions
    spellCount=$( wc -l < XIVNums.txt )
    #get the length of the traits
    traitCount=$( wc -l < XIVTraits.txt )
    #count for the actual number of spells
    count=1
    #count for the number times 5 to account for the 5 different values in each spell
    extraCount=1
    #open brackets
    echo "  \"$1\": {" >> XIVFinal.json
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
    #reset extra count
    echo "      \"traits\": [" >> XIVFinal.json
    #go through all traits
    while [ $extraCount -le $traitCount ];
    do
        echo "          {" >> XIVFinal.json
        #get icon
        echo -n "               \"icon\": " >> XIVFinal.json
        sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
        #get name
        echo -n "               \"name\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get level
        echo -n "               \"level\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get effect
        echo -n "               \"effect\": " >> XIVFinal.json
        sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
        #check if it needs a comma
        count=$((count+1))
        if [ $extraCount -lt $traitCount ]
        then
            echo "          }," >> XIVFinal.json
        else
            echo "          }" >> XIVFinal.json
        fi
    done
    #close it up
    echo "      ]" >> XIVFinal.json
    if [ "$2" == 'end' ]
    then
        echo "  }" >> XIVFinal.json
    else
        echo "  }," >> XIVFinal.json
    fi
}

function outputFileExtra(){
    #get the length of the actions
    spellCount=$( wc -l < XIVNums.txt )
    #get the length of the traits
    traitCount=$( wc -l < XIVTraits.txt )
    #get length of all different actions
    diffCount=$( wc -l < XIVExtra.txt)
    #get length of all commands if needed
    commCount=$( wc -l < XIVCommands.txt)
    #count for the actual number of spells
    count=1
    #count for the number times 5 to account for the 5 different values in each spell
    extraCount=1
    #open brackets
    echo "  \"$1\": {" >> XIVFinal.json
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
    #reset extra count
    echo "      \"$2\": [" >> XIVFinal.json
    #go through all traits
    while [ $extraCount -le $diffCount ];
    do
        echo "          {" >> XIVFinal.json
        #get icon
        echo -n "               \"icon\": " >> XIVFinal.json
        sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
        #get name
        echo -n "               \"name\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get level
        if [ "$2" != 'arcana' ]
        then
            echo -n "               \"level\": " >> XIVFinal.json
            sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
            extraCount=$((extraCount+1))
        fi
        #get type
        echo -n "               \"type\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get cast time
        echo -n "               \"cast\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get recast time
        echo -n "               \"recast\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get cost
        if [ "$2" != 'arcana' ]
        then
            echo -n "               \"cost\": " >> XIVFinal.json
            sed "${extraCount}q;d" "XIVExtra.txt" >> XIVFinal.json
            extraCount=$((extraCount+1))
        fi
        #get effect
        echo -n "               \"effect\": " >> XIVFinal.json
        sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
        #check if it needs a comma
        count=$((count+1))
        if [ $extraCount -lt $diffCount ]
        then
            echo "          }," >> XIVFinal.json
        else
            echo "          }" >> XIVFinal.json
        fi
    done
    #close it up
    echo "      ]," >> XIVFinal.json
    if [ "$3" == "commands" ]
    then
        extraCount=1
        #reset extra count
        echo "      \"$3\": [" >> XIVFinal.json
        #go through all traits
        while [ $extraCount -le $commCount ];
        do
            echo "          {" >> XIVFinal.json
            #get icon
            echo -n "               \"icon\": " >> XIVFinal.json
            sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
            #get name
            echo -n "               \"name\": " >> XIVFinal.json
            sed "${extraCount}q;d" "XIVcommands.txt" >> XIVFinal.json
            extraCount=$((extraCount+1))
            #get effect
            echo -n "               \"effect\": " >> XIVFinal.json
            sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
            #check if it needs a comma
            count=$((count+1))
            if [ $extraCount -le $commCount ]
            then
                echo "          }," >> XIVFinal.json
            else
                echo "          }" >> XIVFinal.json
            fi
        done
        #close it up
        echo "      ]," >> XIVFinal.json
    fi

    extraCount=1
    #reset extra count
    echo "      \"traits\": [" >> XIVFinal.json
    #go through all traits
    while [ $extraCount -le $traitCount ];
    do
        echo "          {" >> XIVFinal.json
        #get icon
        echo -n "               \"icon\": " >> XIVFinal.json
        sed "${count}q;d" "XIVSkillIcon.txt" >> XIVFinal.json
        #get name
        echo -n "               \"name\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVtraits.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get level
        echo -n "               \"level\": " >> XIVFinal.json
        sed "${extraCount}q;d" "XIVTraits.txt" >> XIVFinal.json
        extraCount=$((extraCount+1))
        #get effect
        echo -n "               \"effect\": " >> XIVFinal.json
        sed "${count}q;d" "XIVEffect.txt" >> XIVFinal.json
        #check if it needs a comma
        count=$((count+1))
        if [ $extraCount -lt $traitCount ]
        then
            echo "          }," >> XIVFinal.json
        else
            echo "          }" >> XIVFinal.json
        fi
    done
    #close it up
    echo "      ]" >> XIVFinal.json
    if [ "$3" == 'end' ]
    then
        echo "  }" >> XIVFinal.json
    else
        echo "  }," >> XIVFinal.json
    fi
}

#reset the JSON file
 > XIVFinal.json
echo "{" >> XIVFinal.json
#Takes the URL and gets the name, cast, recast, type, and level, and parses them into the values on new lines with quotation marks between
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
# gets the names and level of every trait (seperated from the other actions since they only have name and level)
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
#Gets the effect of both actions and traits
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
#Gets the icons of both actions and traits
curl https://na.finalfantasyxiv.com/jobguide/paladin/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'paladin'

curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/warrior/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'warrior'

curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/darkknight/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'darkknight'

curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/gunbreaker/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'gunbreaker'

curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/whitemage/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'whitemage'

curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed '0,/trait_action/!d'| sed '/pve_pet_action/,/healer_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed -n '/pve_action/,/Simple Mode/p '| sed -n '/Pet Actions (Commands)/,/healer_action/p'| grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVCommands.txt
curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed -n '/pve_action/,/Simple Mode/p '| sed -n '/pve_pet_action/,/Pet Actions (Commands)/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/scholar/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'scholar' 'petactions' 'commands'

curl https://na.finalfantasyxiv.com/jobguide/astrologian/ | sed '0,/trait_action/!d'| sed '/pve_card_action/,/healer_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/astrologian/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/astrologian/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/astrologian/ | sed -n '/pve_action/,/Simple Mode/p '| sed -n '/pve_card_action/,/healer_action/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/astrologian/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'astrologian' 'arcana' 


curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/sage/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'sage'

curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/trait_action/!d' | grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed -n '/trait_action/,/Changing Form/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/Changing Form/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/monk/ | sed '0,/Changing Form/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'monk'

curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/dragoon/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'dragoon'

curl https://na.finalfantasyxiv.com/jobguide/ninja/ | sed '0,/trait_action/!d'| sed '/pve_jyutsu_action/,/melee_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/ninja/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' |sed 's/"man."/man/g'|sed 's/"heaven."/heaven/g'|sed 's/"earth."/earth/g'| sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/ninja/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/ninja/ | sed -n '/pve_action/,/Combo Sequence/p '|sed -n '/pve_jyutsu_action/,/melee_action/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/ninja/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'ninja' 'ninjutsu'

curl https://na.finalfantasyxiv.com/jobguide/samurai/ | sed '0,/trait_action/!d'| sed '/pve_jyutsu_action/,/melee_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/samurai/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/samurai/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/samurai/ | sed -n '/pve_action/,/Combo Sequence/p '| sed -n '/pve_jyutsu_action/,/melee_action/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/samurai/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'samurai' 'iaijutsu'


curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/reaper/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'reaper'

curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/bard/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'bard'

curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/machinist/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'machinist'

curl https://na.finalfantasyxiv.com/jobguide/dancer/ | sed '0,/trait_action/!d'| sed '/pve_jyutsu_action/,/prange_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/dancer/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/dancer/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/dancer/ | sed -n '/pve_action/,/Combo Sequence/p '| sed -n '/pve_jyutsu_action/,/prange_action/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/dancer/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'dancer' 'stepactions'

curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/blackmage/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'blackmage'

curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed '0,/trait_action/!d'| sed '/pve_pet_action/,/mrange_action/d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed -n '/pve_action/,/Simple Mode/p '| sed -n '/Pet Actions (Commands)/,/mrange_action/p'| grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVCommands.txt
curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed '0,/Simple Mode/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed '0,/Simple Mode/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed -n '/pve_action/,/Simple Mode/p '| sed -n '/pve_pet_action/,/Pet Actions (Commands)/p'| grep -E 'strong|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVExtra.txt
curl https://na.finalfantasyxiv.com/jobguide/summoner/ | sed -n '/trait_action/,/Simple Mode/p ' | grep -E 'strong|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
outputFileExtra 'summoner' 'petactions' 'commands'

curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/trait_action/!d' | grep -E '<strong>|class="cast"|class="recast"|class="classification"|class="cost"|Lv. ' | sed 's/<[^>]*>//g'|sed 's/Lv. //g' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVNums.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed -n '/trait_action/,/Combo Sequence/p ' | grep -E '<strong>|Lv.' | sed 's/<[^>]*>//g'|sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/^/\"/'| sed 's/$/\",/' > XIVTraits.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/Combo Sequence/!d'| sed -n '/<td class="content">/,/<\/td>/p' | sed -n '/<td class="content">/,/<\/td>/{ /<td class="content">/! { /<\/td>/! p}  } '|sed '/^[[:space:]]*$/d' |sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' |sed 's/$/\"/'|  sed 's/^/\"/'> XIVEffect.txt
curl https://na.finalfantasyxiv.com/jobguide/redmage/ | sed '0,/Combo Sequence/!d'| grep -E 'class="job__skill_icon"' |sed -e 's/<div class="job__skill_icon"><img src=//'| sed -e 's/ width="40" height="40" alt=""><\/div>//'| sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'| sed 's/$/,/' > XIVSkillIcon.txt
outputFile 'redmage' 'end'

echo "}" >> XIVFinal.json

rm XIVCommands.txt
rm XIVEffect.txt
rm XIVExtra.txt
rm XIVNums.txt
rm XIVSkillIcon.txt
rm XIVTraits.txt

JobGuideDestination=../src/modules/xiv/actionData/jobGuide.json
echo -n "export default " > $JobGuideDestination
cat XIVFinal.json >> $JobGuideDestination