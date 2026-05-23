import * as logger from "deno-log";
import { fromFileUrl } from "deno-mod";

{
    await Deno.create(
        fromFileUrl(
            new URL("../../app.log", import.meta.url)
        ).replaceAll("\\", "/")
    );
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

export default logger;
