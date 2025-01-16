import { BehaviorSubject } from "rxjs";
import { ISQLiteService } from "../services/sqliteService";
import { IDbVersionService } from "./dbVersionService";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { NoteUpgradeStatements } from "../databases/upgrades/note.upgrade.statements";
import { QuizAttemptUpgradeStatements } from "../databases/upgrades/quizattempt.upgrade.statement";
import { QuestionUpgradeStatements } from "../databases/upgrades/question.upgrade.statements";
import { QuizUpgradeStatements } from "../databases/upgrades/quiz.upgrade.statements";
import { OptionAnswerUpgradeStatements } from "../databases/upgrades/optionanswer.upgrade.statements";
import { OptionUpgradeStatements } from "../databases/upgrades/option.upgrade.statements";
import { MessageUpgradeStatements } from "../databases/upgrades/message.upgrade.statements";
import { IdentificationAnswerUpgradeStatements } from "../databases/upgrades/identification.upgrade.statements";
import { EssayStrengthUpgradeStatements } from "../databases/upgrades/essaystrength.upgrade.statements";
import { EssayAreaOfImprovementUpgradeStatements } from "../databases/upgrades/essayimprovement.upgrade.statements";
import { EssayFeedbackUpgradeStatements } from "../databases/upgrades/essayfeedback.upgrade.statements";
import { EssayEvaluationUpgradeStatements } from "../databases/upgrades/essayevaluation.upgrade.statements";
import { EssayAnswerUpgradeStatements } from "../databases/upgrades/essayanswer.upgrade.statements";
import { ConversationUpgradeStatements } from "../databases/upgrades/conversation.upgrade.statements";
import NoteRepository from "@/repository/NoteRepository";
import QuizRepository from "@/repository/QuizRepository";
import QuestionRepository from "@/repository/QuestionRepository";
import EssayRepository from "@/repository/EssayRepository";
import AttemptQuizRepository from "@/repository/AttemptQuizRepository";
import AttemptQuizService from "./attemptQuizService";
import { table } from "console";
import ConversationRepository from "@/repository/ConversationRepository";

export interface IStorageService {
  initializeDatabase(): Promise<void>;
  noteRepo: NoteRepository;
  quizRepo: QuizRepository;
  getDatabaseName(): string;
  getDatabaseVersion(): number;
}

class StorageService implements IStorageService {
  versionUpgrades = [
    ...NoteUpgradeStatements,
    ...QuizUpgradeStatements,
    ...QuestionUpgradeStatements,
    ...QuizAttemptUpgradeStatements,
    ...OptionUpgradeStatements,
    ...OptionAnswerUpgradeStatements,
    ...MessageUpgradeStatements,
    ...IdentificationAnswerUpgradeStatements,
    ...EssayAnswerUpgradeStatements,
    ...EssayEvaluationUpgradeStatements,
    ...EssayFeedbackUpgradeStatements,
    ...EssayAreaOfImprovementUpgradeStatements,
    ...EssayStrengthUpgradeStatements,
    ...ConversationUpgradeStatements,
  ].map((upgrade) => ({
    toVersion: upgrade.toVersion, // Use toVersion as the version
    statements: upgrade.statements, // The SQL statements for the upgrade
  }));
  loadToVersion = 1;
  // this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  db!: SQLiteDBConnection;
  database: string = "myuserdb";
  sqliteServ!: ISQLiteService;
  dbVerServ!: IDbVersionService;
  isInitCompleted = new BehaviorSubject(false);

  noteRepo!: NoteRepository;
  quizRepo!: QuizRepository;
  questionRepo!: QuestionRepository;
  optionRepo!: QuestionRepository;
  essayRepo!: EssayRepository;
  attemptQuizRepo!: AttemptQuizRepository;
  attemptQuizService!: AttemptQuizService;
  conversationRepo!: ConversationRepository;
  constructor(
    sqliteService: ISQLiteService,
    dbVersionService: IDbVersionService
  ) {
    this.sqliteServ = sqliteService;
    this.dbVerServ = dbVersionService;
  }

  getDatabaseName(): string {
    return this.database;
  }

  getDatabaseVersion(): number {
    return this.loadToVersion;
  }

  async initializeDatabase(): Promise<void> {
    try {
      // Apply each upgrade statement sequentially
      // Apply upgrade statements, correctly formatted as capSQLiteVersionUpgrade[]

      // Open the database with the final version
      this.db = await this.sqliteServ.openDatabase(
        this.database,
        this.loadToVersion,
        false
      );
      this.versionUpgrades.forEach(async (upgrade) => {
        this.db.query(upgrade.statements[0], []);
      });

      const result = await this.db.query(
        'SELECT name FROM sqlite_master WHERE type="table";'
      );
      console.log("tables", result);
      // Set the database version after the upgrades

      this.dbVerServ.setDbVersion(this.database, this.loadToVersion);

      this.noteRepo = new NoteRepository(this.db);
      this.quizRepo = new QuizRepository(this.db);

      this.questionRepo = new QuestionRepository(this.db);
      this.optionRepo = new QuestionRepository(this.db);
      this.essayRepo = new EssayRepository(this.db);
      this.attemptQuizRepo = new AttemptQuizRepository(this.db);
      this.conversationRepo = new ConversationRepository(this.db);

      this.attemptQuizService = new AttemptQuizService(
        this.attemptQuizRepo,
        this.questionRepo,
        this.essayRepo
      );
      // Mark the initialization as completed
      this.isInitCompleted.next(true);
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`storageService.initializeDatabase: ${msg}`);
    }
  }
}

export default StorageService;
