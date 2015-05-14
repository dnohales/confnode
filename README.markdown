# Conf.Node Project Notes

##TODO:
- Fix CSS styles for the tags' inputs.

##PIO app deployment
1. Install PIO:
>`bash -c "$(curl -s https://install.prediction.io/install.sh)"`
2. Start PIO:
>`pio-start-all`
3. Install PIO Recommendation template:
>`pio template get PredictionIO/template-scala-parallel-recommendation <Template Name>`  
>`cd <Template Name>`
4. Create new PIO app:
>`pio app new <App Name>`
5. At this point, make sure the engine.json file has the correct appname set
6. Import file to the app with the events to train with:
>`pio import --appid <App ID> --input <Events File>`
7. Build the app:
>`pio build`
8. Train the app:
>`pio train`
9. Deploy the app:
>`pio deploy`
