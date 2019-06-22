'use babel';

import AutomataView from './automata-view';
import { CompositeDisposable, Directory, TextEditor, File } from 'atom';
import syncImports from './sync-imports';
import readConfig from './read-config';


export default {

  automataView: null,
  modalPanel: null,
  subscriptions: null,
  files: null,
  configs: null,

  initialize(state) {
    this.subscriptions = new CompositeDisposable();
    this.files = {};
    this.configs = {};
    atom.workspace.observeTextEditors((editor) => {
      this.subscriptions.add(editor.onDidSave((event) => {
        this.syncImports(event);
      }))
    });
  },

  activate(state) {
    this.automataView = new AutomataView(state.automataViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.automataView.getElement(),
      visible: false
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'automata:syncImports': () => this.syncImports()
    }));
  },


  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.automataView.destroy();
  },

  serialize() {
    return {
      automataViewState: this.automataView.serialize()
    };
  },

  async syncImports (event) {
    const file = new File(event.path);

    if (!this.files[event.path]) {
      this.files[event.path] = new File(event.path);
    }

    if (!this.configs[event.path]) {
      this.configs[event.path] = await readConfig(this.files[event.path]);
    }
    await syncImports(this.files[event.path], this.configs[event.path]);
  }

};
