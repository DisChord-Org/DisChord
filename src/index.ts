import Init from './init/Init';

new Init().run().catch(error => {
    console.log(error);
    process.exit(1);
});