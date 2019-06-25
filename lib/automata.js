'use babel';

import AutomataView from './automata-view';
import { CompositeDisposable, Directory, TextEditor, File } from 'atom';
import createStore from './store';
import { fileSaved } from './files/redux/actions';


export default {

  automataView: null,
  modalPanel: null,
  subscriptions: null,
  files: null,
  configs: null,

  initialize(state) {

  },

  activate(state) {
    console.log("STATE", state);
    this.automataView = new AutomataView(state.automataViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.automataView.getElement(),
      visible: false
    });

    this.store = createStore();

    this.subscriptions = new CompositeDisposable();
    this.files = {};
    this.configs = {};
    atom.workspace.observeTextEditors((editor) => {
      this.subscriptions.add(editor.onDidSave((event) => {
        setTimeout(() => {
          this.store.dispatch(fileSaved(event.path));
        });
      }))
    });
  },


  deactivate() {
    this.store.destroy();
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.automataView.destroy();
  },

  serialize() {
    return {
      automataViewState: this.automataView.serialize(),
      store: this.store.getState(),
    };
  },
};
