import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';
import { DataService } from '../../services/data.service';

declare const ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    sessionId: string;
    editor: any;
    languages: string[] = ['Java', 'Python'];
    language: string = 'Java';
    output: string = '';
    
    defaultContent = {
        'Java': `public class Example {
            public static void main(String[] args) {
                // Type your Java code here
            }
        }`,
        'Python': `class Example:
        def example():
            # Write your Python code here`
    };
    
    constructor(private collaboration: CollaborationService, private route: ActivatedRoute, private dataService: DataService) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.sessionId = params['id'];
            this.initEditor();
            this.collaboration.restoreBuffer();
        });
    }

    initEditor() {
      this.editor = ace.edit("editor");
      this.editor.setTheme("ace/theme/eclipse");
      this.resetEditor();
        this.editor.$blockScrolling = Infinity;
        // set up collaboration socket
      this.collaboration.init(this.editor, this.sessionId);
      this.editor.lastAppliedChange = null;  
// register change callback
        this.editor.on('change', (e) => {
            if (this.editor.lastAppliedChange != e) {
                this.collaboration.change(JSON.stringify(e));
            } 
        });
    }
    
    resetEditor(): void {
        this.editor.setValue(this.defaultContent[this.language]);
        this.editor.getSession().setMode("ace/mode/" + this.language.toLowerCase());
    }

    setLanguage(language: string): void {
        this.language = language;
        this.resetEditor();
    }

    submit(): void {
        this.output = '';
        const codes = {
            userCodes: this.editor.getValue(),
            lang: this.language.toLocaleLowerCase()
        };
        this.dataService.buildAndRun(codes)
            .then((res: any) => this.output = res.text);
    }
    // todo: add cursor movement sync
}
