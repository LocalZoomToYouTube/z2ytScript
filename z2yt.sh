#!/bin/sh
echo "\nEnter Title"
read NAME
echo "title: $NAME" > ./vids/upload.txt
echo "\nEnter Description"
read description
echo "description: $description" >> ./vids/upload.txt
echo ""
PS3='Enter Listing Choice: '
options=("Public" "Private" "Unlisted")
select opt in "${options[@]}"
do
    case $opt in
        "Public")
            echo "\n"
            break
            ;;
        "Private")
            echo "\n"
            break
            ;;
        "Unlisted")
            echo "\n"
            break
            ;;
        *) echo invalid option;;
    esac
done
echo "listing: $opt" >> ./vids/upload.txt


# for i in ./vids/*.mp4; do
#   mv "$i" ./vids/"$name.mp4"
# done