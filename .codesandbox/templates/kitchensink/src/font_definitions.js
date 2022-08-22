(function() {
  if (typeof Cufon == 'undefined') return;

  var fontDefinitions = {
    'Modernist_One_400':                  85,
    'Quake_Cyr':                          100,
    'Terminator_Cyr':                     10,
    'Vampire95':                          85,
    'Encient_German_Gothic_400':          110,
    'OdessaScript_500':                   180,
    'Globus_500':                         100,
    'CrashCTT_400':                       60,
    'CA_BND_Web_Bold_700':                60,
    'Delicious_500':                      80,
    'Tallys_400':                         70,
    'DejaVu Serif':                       130
  };
  for (var prop in fontDefinitions) {
    if (Cufon.fonts[prop.toLowerCase()]) {
      Cufon.fonts[prop.toLowerCase()].offsetLeft = fontDefinitions[prop];
    }
  }
})();