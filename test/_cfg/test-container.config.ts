import { container } from "tsyringe";
import { TestUtil } from "../util/test.util";

container.registerSingleton('test-util', TestUtil);