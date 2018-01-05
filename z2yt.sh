#!/bin/sh
echo "\nEnter Title"
read NAME
echo "title: $NAME" > /Users/$USER/Documents/Zoom/upload.txt
echo "\nEnter Description"
read description
echo "description: $description" >> /Users/$USER/Documents/Zoom/upload.txt
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
echo "listing: $opt" >> /Users/$USER/Documents/Zoom/upload.txt


# for i in ./vids/*.mp4; do
#   mv "$i" ./vids/"$name.mp4"
# done