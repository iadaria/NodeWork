for i in {1..3}
do
  echo "0$i/test.js"
  cd "0$i"
  node "test.js"
  cd ".."
done
