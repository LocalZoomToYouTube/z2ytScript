#!/bin/sh
printf '\e[1t'
printf '\e[5t'
echo "\nEnter Title"
read NAME
echo "title: $NAME" > /Users/$USER/.zoom_to_youtube/upload.txt
echo "\nEnter Description"
read description
echo "description: $description" >> /Users/$USER/.zoom_to_youtube/upload.txt
echo ""
PS3='Enter Listing Choice: '
options=("public" "private" "unlisted")
select opt in "${options[@]}"
do
    case $opt in
        "public")
            echo "\n"
            break
            ;;
        "private")
            echo "\n"
            break
            ;;
        "unlisted")
            echo "\n"
            break
            ;;
        *) echo invalid option;;
    esac
done
echo "listing: $opt" >> /Users/$USER/.zoom_to_youtube/upload.txt


# for i in ./vids/*.mp4; do
#   mv "$i" ./vids/"$name.mp4"
# done