/* FOR GENERATING A CRASH DUMP ON Electron
const electron = require("electron");
electron.crashReporter.start({ uploadToServer: false });
*/

console.log('Will crash on electron')
require('@pcsc-mini/windows-x86_64');
console.log('@pcsc-mini/windows-x86_64 loaded successfully');

console.log('Will crash on electron too')
const pcsc = require( "pcsc-mini");
console.log('pcsc-mini created successfully');

const { CardDisposition, CardMode, ReaderStatus } = pcsc;

const client = new pcsc.Client()
  .on("reader", onReader)
  .start();

function onReader(reader) {
  reader.on("change", async status => {
    console.log(`Reader ${reader.name()} status changed:`, status);
    if (!status.has(ReaderStatus.PRESENT)) return;
    if (status.hasAny(ReaderStatus.MUTE, ReaderStatus.IN_USE)) return;

    const card = await reader.connect(CardMode.SHARED);
    console.log(`Card connected`);
    console.log(`${await card.state()}`);

    await card.disconnect(CardDisposition.RESET);

    console.log("Card disconnected");

    client.stop();

    console.log("Card disconnected, client stopped.");
    process.exit(0);
  });
}
