<script setup lang="ts">
const { dialog, close } = useBoardDialogs()
const { create, rename, remove } = useBoards()
const route = useRoute()

// Kept while a dialog fades out, so its title does not jump when `dialog` is already null.
const shown = ref(dialog.value)
const name = ref('')
watch(dialog, (value) => {
  if (!value) return
  shown.value = value
  name.value = value.kind === 'create' ? '' : value.board.name
})

const naming = computed(() => dialog.value?.kind === 'create' || dialog.value?.kind === 'rename')

async function onSave() {
  const current = dialog.value
  const trimmed = name.value.trim()
  if (!trimmed) return
  close()
  if (current?.kind === 'rename') return rename(current.board.id, trimmed)
  const board = await create(trimmed)
  await navigateTo(`/boards/${board.id}`)
}

// Deleting the open board leads back to the start page.
// Reads `shown`, because the delete button closes the dialog before this runs.
async function onDelete() {
  if (shown.value?.kind !== 'delete') return
  const { id } = shown.value.board
  await remove(id)
  if (route.params.id === id) await navigateTo('/')
}
</script>

<template>
  <Dialog :open="naming" @update:open="open => !open && close()">
    <DialogContent>
      <form class="grid gap-4" @submit.prevent="onSave">
        <DialogHeader>
          <DialogTitle>{{ shown?.kind === 'rename' ? 'Board umbenennen' : 'Neues Board' }}</DialogTitle>
        </DialogHeader>
        <Input v-model="name" placeholder="Name des Boards" autofocus />
        <DialogFooter>
          <Button type="submit" :disabled="!name.trim()">
            {{ shown?.kind === 'rename' ? 'Speichern' : 'Anlegen' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <AlertDialog :open="dialog?.kind === 'delete'" @update:open="open => !open && close()">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Board „{{ name }}“ löschen?</AlertDialogTitle>
        <AlertDialogDescription>Alle Objekte darauf gehen verloren.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction variant="destructive" @click="onDelete">Löschen</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
