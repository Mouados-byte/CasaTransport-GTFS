import * as logger from "deno-log";
import { BASE_DIR } from "../constants.ts";

{
    await Deno.create(BASE_DIR + "/app.log");
}

logger.setup({
    handlers: {
        console: new logger.ConsoleHandler("DEBUG", {
            formatter: record =>
                `${record.datetime.toISOString()} [${record.levelName}]: ${record.msg}`
        }),
        file: new logger.FileHandler("WARN", {
            filename: "app.log",
            formatter: record => JSON.stringify({
                timestam: record.datetime.toISOString(),
                level: record.levelName,
                message: record.msg,
                args: record.args
            })
        })
    },
    loggers: {
        default: {
            level: "INFO",
            handlers: ["console", "file"]
        }
    }
});

if (Deno.args.includes("--debug")) {
    logger.getLogger().level = logger.getLevelByName("DEBUG");
}

export default logger;
